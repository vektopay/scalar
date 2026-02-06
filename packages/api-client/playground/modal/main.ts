import { createApiClientModal } from '@/index'

const { client } = await createApiClientModal({
  el: document.getElementById('app'),
  configuration: {
    url: 'https://registry.vektopay.com/@vektopay/apis/galaxy?format=json',
    proxyUrl: 'https://proxy.vektopay.com',
  },
})

// Open the API client right-away
client.open()

document.getElementById('button')?.addEventListener('click', () => open())

// Or: Open a specific operation
// open({
//   method: 'GET',
//   path: '/me',
// })
