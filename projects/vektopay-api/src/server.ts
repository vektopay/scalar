import { readFile } from 'node:fs/promises'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

import { assertConfig, config } from './config'
import {
  clearEmbeddings,
  getDocumentBySlug,
  getEmbeddingStatus,
  initDb,
  insertDocument,
  insertEmbeddings,
  listDocuments,
  searchByEmbedding,
} from './db'
import { embedTexts } from './embeddings'
import {
  chunkText,
  extractMetadata,
  generateSlug,
  parseOpenApi,
  summarizeDocument,
} from './openapi'
import { generateSdkZip, SUPPORTED_SDKS } from './sdk'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization', 'x-scalar-agent-key'],
  }),
)

app.get('/healthz', (c) => c.json({ ok: true }))

app.get('/auth/session', async (c) => {
  if (!config.authVerifyUrl) {
    return c.json({ authenticated: false })
  }

  const headers: Record<string, string> = {}
  const authHeader = c.req.header('authorization')
  const cookie = c.req.header('cookie')

  if (authHeader) {
    headers.authorization = authHeader
  }

  if (cookie) {
    headers.cookie = cookie
  }

  const response = await fetch(config.authVerifyUrl, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    return c.json({ authenticated: false }, 401)
  }

  return c.json({ authenticated: true })
})

app.post('/core/share/upload/apis', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const schema = z.object({ document: z.any() })
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return c.json({ message: 'Invalid payload', code: 'INVALID_PAYLOAD' }, 400)
  }

  let document
  try {
    if (typeof parsed.data.document === 'string' && !parsed.data.document.trim()) {
      return c.json({ message: 'Empty document', code: 'EMPTY_DOCUMENT' }, 400)
    }
    document = parseOpenApi(parsed.data.document)
  } catch (error) {
    return c.json({ message: 'Invalid OpenAPI document', code: 'INVALID_OPENAPI' }, 400)
  }
  const { title, version, logoUrl } = extractMetadata(document)
  const namespace = config.defaultNamespace
  const slug = generateSlug({ title })

  const expiresAt = new Date(Date.now() + config.uploadTtlDays * 24 * 60 * 60 * 1000)

  const record = await insertDocument({
    namespace,
    slug,
    title,
    version,
    logoUrl,
    source: document,
    expiresAt,
  })

  try {
    const summary = summarizeDocument(document)
    const chunks = chunkText(summary)
    const embeddings = await embedTexts(chunks)

    if (embeddings.some((embedding) => embedding.length !== config.embeddingDimensions)) {
      throw new Error('Embedding dimensions mismatch')
    }

    await clearEmbeddings(record.id)
    await insertEmbeddings({
      documentId: record.id,
      rows: chunks.map((content, index) => ({ content, embedding: embeddings[index] })),
    })
  } catch (error) {
    console.warn('Embedding failed', error)
  }

  const url = new URL(`/share/apis/${namespace}/${slug}`, config.registryBaseUrl).toString()

  return c.json({ url, namespace, slug })
})

app.get('/share/apis/:namespace/:slug', async (c) => {
  const { namespace, slug } = c.req.param()
  const record = await getDocumentBySlug(namespace, slug)

  if (!record) {
    return c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404)
  }

  const sdks = c.req.query('sdks')
  if (sdks !== undefined) {
    const sdkList = sdks
      .split(',')
      .map((sdk) => sdk.trim())
      .filter(Boolean)

    const requestedSdks = sdkList.length ? sdkList : SUPPORTED_SDKS

    try {
      const { zipPath, cleanup } = await generateSdkZip({
        openapi: record.source as object,
        sdks: requestedSdks,
      })

      const file = await readFile(zipPath)
      await cleanup()

      return new Response(file, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="sdks.zip"',
        },
      })
    } catch (error) {
      return c.json({ message: (error as Error).message, code: 'SDK_ERROR' }, 500)
    }
  }

  return c.json(record.source)
})

app.get('/@:namespace/apis/:slug/latest', async (c) => {
  const { namespace, slug } = c.req.param()
  const record = await getDocumentBySlug(namespace, slug)

  if (!record) {
    return c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404)
  }

  return c.json(record.source)
})

app.get('/vector/registry/embeddings/:namespace/:slug', async (c) => {
  const { namespace, slug } = c.req.param()
  const record = await getDocumentBySlug(namespace, slug)

  if (!record) {
    return c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404)
  }

  const count = await getEmbeddingStatus(record.id)
  if (count === 0) {
    return c.json({ message: 'Embeddings not ready', code: 'NOT_READY' }, 404)
  }

  return c.json({ ready: true })
})

app.get('/vector/registry/document/:namespace/:slug', async (c) => {
  const { namespace, slug } = c.req.param()
  const record = await getDocumentBySlug(namespace, slug)

  if (!record) {
    return c.json({ message: 'Not found', code: 'NOT_FOUND' }, 404)
  }

  return c.json({
    id: record.id,
    title: record.title,
    namespace: record.namespace,
    currentVersion: record.version,
    logoUrl: record.logo_url,
    slug: record.slug,
  })
})

app.get('/vector/registry/documents', async (c) => {
  const documents = await listDocuments({ limit: 50 })
  return c.json({
    documents: documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      namespace: doc.namespace,
      currentVersion: doc.version,
      logoUrl: doc.logo_url,
      slug: doc.slug,
    })),
  })
})

app.get('/vector/registry/curated', async (c) => {
  const documents = await listDocuments({ limit: 5 })
  return c.json({
    results: documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      namespace: doc.namespace,
      currentVersion: doc.version,
      logoUrl: doc.logo_url,
      slug: doc.slug,
    })),
  })
})

app.get('/vector/registry/search', async (c) => {
  const query = c.req.query('query') ?? ''
  if (!query) {
    return c.json({ results: [] })
  }

  try {
    const [embedding] = await embedTexts([query])
    if (!embedding) {
      return c.json({ results: [] })
    }

    const results = await searchByEmbedding({ embedding, limit: 10 })
    return c.json({
      results: results.map((row) => ({
        id: row.id,
        title: row.title,
        namespace: row.namespace,
        currentVersion: row.version,
        logoUrl: row.logo_url,
        slug: row.slug,
      })),
    })
  } catch (error) {
    console.warn('Vector search failed', error)
    return c.json({ results: [] })
  }
})

app.post('/vector/openapi/chat', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const schema = z.object({
    messages: z.array(z.any()).default([]),
    registryDocuments: z
      .array(z.object({ namespace: z.string(), slug: z.string() }))
      .default([]),
  })
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return c.json({ message: 'Invalid payload', code: 'INVALID_PAYLOAD' }, 400)
  }

  const docs = await Promise.all(
    parsed.data.registryDocuments.map(({ namespace, slug }) => getDocumentBySlug(namespace, slug)),
  )

  const context = docs
    .filter(Boolean)
    .map((doc) => summarizeDocument(doc!.source as any))
    .join('\n\n')

  const system = [
    'You are Vektopay Agent, an internal API assistant.',
    'Use the provided API summaries to answer questions. If unsure, say you do not know.',
    context ? `\nAvailable APIs:\n${context}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const model =
    config.aiProvider === 'gemini'
      ? google(config.geminiChatModel, { apiKey: config.geminiApiKey })
      : openai(config.openaiChatModel, { apiKey: config.openaiApiKey })

  const result = streamText({
    model,
    system,
    messages: convertToModelMessages(parsed.data.messages),
  })

  return result.toDataStreamResponse()
})

const shouldInitDb = process.argv.includes('--init-db')

async function start() {
  assertConfig()
  await initDb()

  if (shouldInitDb) {
    console.log('Database initialized.')
    process.exit(0)
  }

  console.log(`Vektopay API listening on :${config.port}`)
  Bun.serve({
    fetch: app.fetch,
    port: config.port,
  })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
