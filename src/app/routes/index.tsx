import { createBrowserRouter, RouterProvider } from 'react-router'
import publicRoutes from './private-routes'
import privateRoutes from './private-routes'
import { useAuthStore } from '@/modules/auth/hooks/useAuth'

export default function Router() {
  const { isAuthenticated } = useAuthStore()

  const availableRoute = isAuthenticated ? privateRoutes : publicRoutes

  const appRouter = createBrowserRouter(availableRoute)

  return (
    <RouterProvider router={appRouter} />
  )
}
