import { createWriteStream } from 'node:fs'
import { spawn } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import archiver from 'archiver'

import { config } from './config'

const SDK_MAP: Record<string, { generator: string; folder: string }> = {
  typescript: { generator: 'typescript-fetch', folder: 'typescript' },
  python: { generator: 'python', folder: 'python' },
  csharp: { generator: 'csharp', folder: 'csharp' },
  java: { generator: 'java', folder: 'java' },
  ruby: { generator: 'ruby', folder: 'ruby' },
  php: { generator: 'php', folder: 'php' },
  go: { generator: 'go', folder: 'go' },
}

export const SUPPORTED_SDKS = Object.keys(SDK_MAP)

export async function generateSdkZip({
  openapi,
  sdks,
}: {
  openapi: object
  sdks: string[]
}) {
  if (config.sdkGenerator === 'none') {
    throw new Error('SDK generation is disabled on this server')
  }

  const selected = sdks.map((sdk) => SDK_MAP[sdk]).filter(Boolean)
  if (!selected.length) {
    throw new Error('No supported SDKs requested')
  }

  if (config.sdkGenerator === 'remote') {
    return generateSdkZipRemote({ openapi, sdks: selected })
  }

  if (config.sdkGenerator === 'openapi-generator') {
    return generateSdkZipLocal({ openapi, sdks: selected })
  }

  throw new Error('Unsupported SDK generator mode')
}

async function generateSdkZipLocal({
  openapi,
  sdks,
}: {
  openapi: object
  sdks: Array<{ generator: string; folder: string }>
}) {
  const jobId = `job-${Date.now()}`
  const baseDir = join(config.sdkTmpDir, jobId)
  const specPath = join(baseDir, 'openapi.json')
  const outputZip = join(config.sdkTmpDir, `${jobId}.zip`)

  await mkdir(baseDir, { recursive: true })
  await writeFile(specPath, JSON.stringify(openapi, null, 2), 'utf8')

  for (const sdk of sdks) {
    const outDir = join(baseDir, sdk.folder)
    await mkdir(outDir, { recursive: true })

    await run('openapi-generator-cli', [
      'generate',
      '-i',
      specPath,
      '-g',
      sdk.generator,
      '-o',
      outDir,
      '--skip-validate-spec',
    ])
  }

  await zipDirectory(baseDir, outputZip)

  return {
    zipPath: outputZip,
    cleanup: async () => {
      await rm(baseDir, { recursive: true, force: true })
      await rm(outputZip, { force: true })
    },
  }
}

async function generateSdkZipRemote({
  openapi,
  sdks,
}: {
  openapi: object
  sdks: Array<{ generator: string; folder: string }>
}) {
  const jobId = `job-${Date.now()}`
  const baseDir = join(config.sdkTmpDir, jobId)
  const outputZip = join(config.sdkTmpDir, `${jobId}.zip`)

  await mkdir(baseDir, { recursive: true })

  const downloads = await Promise.all(
    sdks.map(async (sdk) => {
      const link = await requestRemoteSdk({ openapi, generator: sdk.generator })
      const response = await fetch(link)
      if (!response.ok) {
        throw new Error(`Failed to download ${sdk.generator} SDK`) 
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      return { folder: sdk.folder, buffer }
    }),
  )

  await zipBuffers(downloads, outputZip)

  return {
    zipPath: outputZip,
    cleanup: async () => {
      await rm(baseDir, { recursive: true, force: true })
      await rm(outputZip, { force: true })
    },
  }
}

async function requestRemoteSdk({
  openapi,
  generator,
}: {
  openapi: object
  generator: string
}) {
  const response = await fetch(
    `${config.openapiGeneratorUrl}/api/gen/clients/${generator}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec: openapi }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SDK generation failed: ${error}`)
  }

  const data = (await response.json()) as { link?: string }
  if (!data.link) {
    throw new Error('SDK generation failed: missing download link')
  }

  return data.link
}

function run(command: string, args: string[], cwd?: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' })

    child.on('error', reject)
    child.on('exit', (code: number) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(new Error(`${command} exited with code ${code}`))
    })
  })
}

async function zipDirectory(source: string, out: string) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const output = createWriteStream(out)

  return new Promise<void>((resolve, reject) => {
    output.on('close', () => resolve())
    output.on('error', reject)
    archive.on('error', reject)

    archive.pipe(output)
    archive.directory(source, false)
    archive.finalize()
  })
}

async function zipBuffers(buffers: Array<{ folder: string; buffer: Buffer }>, out: string) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const output = createWriteStream(out)

  return new Promise<void>((resolve, reject) => {
    output.on('close', () => resolve())
    output.on('error', reject)
    archive.on('error', reject)

    archive.pipe(output)
    buffers.forEach(({ folder, buffer }) => {
      archive.append(buffer, { name: `${folder}.zip` })
    })
    archive.finalize()
  })
}
