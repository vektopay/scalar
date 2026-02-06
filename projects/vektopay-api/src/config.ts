export type AiProvider = 'openai' | 'gemini'
export type SdkGeneratorMode = 'remote' | 'openapi-generator' | 'none'

export const config = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL ?? '',
  defaultNamespace: process.env.DEFAULT_NAMESPACE ?? 'vektopay',
  registryBaseUrl: process.env.REGISTRY_BASE_URL ?? 'https://registry.vektopay.com',
  apiBaseUrl:
    process.env.API_BASE_URL ??
    process.env.REGISTRY_BASE_URL ??
    'https://api.vektopay.com',
  sdkGenerator: (process.env.SDK_GENERATOR ?? 'remote') as SdkGeneratorMode,
  openapiGeneratorUrl:
    process.env.OPENAPI_GENERATOR_URL ?? 'https://api.openapi-generator.tech',
  sdkTmpDir: process.env.SDK_TMP_DIR ?? '/tmp/vektopay-sdks',
  authVerifyUrl: process.env.AUTH_VERIFY_URL ?? '',
  uploadTtlDays: Number(process.env.SHARE_TTL_DAYS ?? 7),
  aiProvider: (process.env.AI_PROVIDER ?? 'openai') as AiProvider,
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  openaiChatModel: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiChatModel: process.env.GEMINI_CHAT_MODEL ?? 'gemini-1.5-flash',
  geminiEmbeddingModel: process.env.GEMINI_EMBEDDING_MODEL ?? 'text-embedding-004',
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS ?? 1536),
}

export function assertConfig() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  if (config.aiProvider === 'openai' && !config.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai')
  }

  if (config.aiProvider === 'gemini' && !config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini')
  }
}
