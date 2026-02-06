import { ApiReferenceReact } from '@vektopay/api-reference-react'
import React from 'react'
import '@vektopay/api-reference-react/style.css'

const App = () => {
  return (
    <ApiReferenceReact
      configuration={{
        url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=yaml',
      }}
    />
  )
}

export default App
