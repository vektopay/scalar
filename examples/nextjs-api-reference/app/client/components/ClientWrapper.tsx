'use client'

import { ApiClientModalProvider } from '@vektopay/api-client-react'
import type { OpenClientPayload } from '@vektopay/api-client-react'

import '@vektopay/api-client-react/style.css'
import type { PropsWithChildren } from 'react'

export const ClientWrapper = ({
  children,
  initialRequest,
}: PropsWithChildren<{ initialRequest?: OpenClientPayload }>) => {
  return (
    <ApiClientModalProvider
      initialRequest={initialRequest}
      configuration={{
        url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
      }}>
      {children}
    </ApiClientModalProvider>
  )
}
