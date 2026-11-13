import { RouterProvider } from 'react-router-dom'
import { VaultProvider } from '../features/vault/VaultProvider'
import { router } from './router'

export default function App() {
  return (
    <VaultProvider>
      <RouterProvider router={router} />
    </VaultProvider>
  )
}
