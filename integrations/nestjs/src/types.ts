import type { HtmlRenderingConfiguration } from '@vektopay/core/libs/html-rendering'

export type ApiReferenceOptions = Partial<HtmlRenderingConfiguration>

export type NestJSReferenceConfiguration = ApiReferenceOptions & {
  withFastify?: boolean
}
