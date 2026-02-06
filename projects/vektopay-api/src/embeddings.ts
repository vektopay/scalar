import { config } from './config'

export async function embedTexts(texts: string[]) {
  if (config.aiProvider === 'gemini') {
    return embedWithGemini(texts)
  }

  return embedWithOpenAI(texts)
}

async function embedWithOpenAI(texts: string[]) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.openaiEmbeddingModel,
      input: texts,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI embeddings failed: ${error}`)
  }

  const data = (await response.json()) as {
    data: Array<{ embedding: number[] }>
  }

  return data.data.map((row) => row.embedding)
}

async function embedWithGemini(texts: string[]) {
  const results: number[][] = []

  for (const text of texts) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiEmbeddingModel}:embedContent?key=${config.geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            parts: [{ text }],
          },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini embeddings failed: ${error}`)
    }

    const data = (await response.json()) as { embedding: { values: number[] } }
    results.push(data.embedding.values)
  }

  return results
}
