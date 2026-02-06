import { createApiClientWeb } from '@vektopay/api-client/layouts/Web'
import '@vektopay/api-client/style.css'
import './style.css'

void createApiClientWeb(document.getElementById('scalar-client'), {
  proxyUrl: 'https://proxy.vektopay.com',
})
