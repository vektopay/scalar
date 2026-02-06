'use client'

import { ApiReferenceReact } from '@vektopay/api-reference-react'

export default function ApiReferencePage() {
  return (
    <ApiReferenceReact
      configuration={{
        url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=yaml',
        withDefaultFonts: false,
        hideModels: true,
        tagsSorter: 'alpha',
        searchHotKey: 'k',
        hideDarkModeToggle: true,
        hideDownloadButton: true,
        hiddenClients: true,
        defaultHttpClient: {
          targetKey: 'shell',
          clientKey: 'curl',
        },
        operationsSorter: 'alpha',
      }}
    />
  )
}
