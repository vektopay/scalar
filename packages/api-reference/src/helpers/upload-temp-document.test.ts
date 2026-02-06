import { describe, expect, it, vi } from 'vitest'

import { uploadTempDocument } from './upload-temp-document'

vi.mock('@/consts/urls', () => ({
  PROXY_URL: 'https://proxy.vektopay.com',
  UPLOAD_TEMP_API_URL: 'https://example.test/share/upload/apis',
}))

vi.mock('@vektopay/helpers/url/redirect-to-proxy', () => ({
  redirectToProxy: vi.fn((proxyUrl, url) => `${proxyUrl}?url=${url}`),
}))

describe('uploadTempDocument', () => {
  it('returns a temporary URL', async () => {
    const response = { ok: true, json: () => ({ url: 'https://example.test/doc' }) }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response as Response)

    const result = await uploadTempDocument('test')

    expect(result).toBe('https://example.test/doc')
  })

  it('throws an error on a failed response', async () => {
    const response = { ok: false, status: 500 }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response as Response)

    await expect(uploadTempDocument('test')).rejects.toThrow(
      'Failed to generate temporary link, server responded with 500',
    )
  })

  it('throws an error on a malformed response', async () => {
    const response = { ok: true, json: () => ({}) }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response as Response)

    await expect(uploadTempDocument('test')).rejects.toThrow(
      'Failed to generate temporary link, invalid response from server',
    )
  })
})
