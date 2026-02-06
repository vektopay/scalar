import type { OpenAPIV3_1 } from '@vektopay/openapi-types'
import { nanoid } from 'nanoid'

export function parseOpenApi(input: unknown): OpenAPIV3_1.Document {
  if (typeof input === 'string') {
    return JSON.parse(input) as OpenAPIV3_1.Document
  }

  return input as OpenAPIV3_1.Document
}

export function extractMetadata(doc: OpenAPIV3_1.Document) {
  const title = doc.info?.title ?? 'Untitled API'
  const version = doc.info?.version ?? 'latest'
  const logoUrl =
    (doc.info as any)?.['x-logo']?.url ??
    (doc as any)?.['x-logo']?.url ??
    null

  return { title, version, logoUrl }
}

export function generateSlug({ title }: { title: string }) {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 48)

  return normalized.length > 4 ? `${normalized}-${nanoid(6)}` : nanoid(8)
}

export function summarizeDocument(doc: OpenAPIV3_1.Document) {
  const title = doc.info?.title ?? 'Untitled API'
  const version = doc.info?.version ?? 'latest'
  const description = doc.info?.description ?? ''
  const servers = (doc.servers ?? []).map((server) => server.url).join(', ')
  const paths = Object.entries(doc.paths ?? {}).flatMap(([path, methods]) =>
    Object.keys(methods ?? {}).map((method) => `${method.toUpperCase()} ${path}`),
  )

  const summary = [
    `Title: ${title}`,
    `Version: ${version}`,
    description ? `Description: ${description}` : '',
    servers ? `Servers: ${servers}` : '',
    paths.length ? `Endpoints: ${paths.slice(0, 120).join(' | ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return summary
}

export function chunkText(text: string, maxSize = 3500) {
  const chunks: string[] = []
  let current = ''

  for (const line of text.split('\n')) {
    if ((current + line).length > maxSize) {
      if (current) {
        chunks.push(current)
      }
      current = line
      continue
    }

    current = current ? `${current}\n${line}` : line
  }

  if (current) {
    chunks.push(current)
  }

  return chunks
}
