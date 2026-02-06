import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Pool } from 'pg'

import { config } from './config'

export const pool = new Pool({ connectionString: config.databaseUrl })

export async function initDb() {
  const schemaPath = resolve(import.meta.dir, 'schema.sql')
  const schema = await readFile(schemaPath, 'utf8')
  const sql = schema.replace('__EMBEDDING_DIM__', String(config.embeddingDimensions))
  await pool.query(sql)
}

export type DocumentRecord = {
  id: string
  namespace: string
  slug: string
  title: string
  version: string
  logo_url: string | null
  source: unknown
  created_at: string
  expires_at: string | null
}

export async function insertDocument({
  namespace,
  slug,
  title,
  version,
  logoUrl,
  source,
  expiresAt,
}: {
  namespace: string
  slug: string
  title: string
  version: string
  logoUrl: string | null
  source: unknown
  expiresAt: Date | null
}) {
  const result = await pool.query<DocumentRecord>(
    `
    INSERT INTO documents (namespace, slug, title, version, logo_url, source, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (namespace, slug)
    DO UPDATE SET title = EXCLUDED.title,
      version = EXCLUDED.version,
      logo_url = EXCLUDED.logo_url,
      source = EXCLUDED.source,
      expires_at = EXCLUDED.expires_at
    RETURNING *
    `,
    [namespace, slug, title, version, logoUrl, source, expiresAt],
  )

  return result.rows[0]
}

export async function getDocumentBySlug(namespace: string, slug: string) {
  const result = await pool.query<DocumentRecord>(
    `
    SELECT *
    FROM documents
    WHERE namespace = $1 AND slug = $2
      AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1
    `,
    [namespace, slug],
  )

  return result.rows[0]
}

export async function listDocuments({ limit = 50 }: { limit?: number } = {}) {
  const result = await pool.query<DocumentRecord>(
    `
    SELECT *
    FROM documents
    WHERE expires_at IS NULL OR expires_at > now()
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit],
  )

  return result.rows
}

export async function insertEmbeddings({
  documentId,
  rows,
}: {
  documentId: string
  rows: { content: string; embedding: number[] }[]
}) {
  if (!rows.length) {
    return
  }

  const values: string[] = []
  const params: Array<string | number[] | string> = []
  let paramIndex = 1

  for (const row of rows) {
    values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}::vector)`)
    params.push(documentId, row.content, vectorToSql(row.embedding))
  }

  await pool.query(
    `
    INSERT INTO document_embeddings (document_id, content, embedding)
    VALUES ${values.join(', ')}
    `,
    params,
  )
}

export async function clearEmbeddings(documentId: string) {
  await pool.query(`DELETE FROM document_embeddings WHERE document_id = $1`, [documentId])
}

export async function getEmbeddingStatus(documentId: string) {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM document_embeddings WHERE document_id = $1`,
    [documentId],
  )
  return Number(result.rows[0]?.count ?? 0)
}

export async function searchByEmbedding({
  embedding,
  limit = 10,
}: {
  embedding: number[]
  limit?: number
}) {
  const result = await pool.query<{
    id: string
    title: string
    namespace: string
    slug: string
    version: string
    logo_url: string | null
    distance: number
  }>(
    `
    SELECT d.id, d.title, d.namespace, d.slug, d.version, d.logo_url,
      (e.embedding <-> $1::vector) AS distance
    FROM document_embeddings e
    JOIN documents d ON d.id = e.document_id
    WHERE d.expires_at IS NULL OR d.expires_at > now()
    ORDER BY e.embedding <-> $1::vector ASC
    LIMIT $2
    `,
    [vectorToSql(embedding), limit],
  )

  return result.rows
}

export function vectorToSql(embedding: number[]) {
  return `[${embedding.join(',')}]`
}
