import { createBrowserRouter, RouterProvider } from 'react-router'
import publicRoutes from './private-routes'
import privateRoutes from './private-routes'

export default function Router() {

  const availableRoute = false ? privateRoutes : publicRoutes

  const appRouter = createBrowserRouter(availableRoute)

  return (
    <RouterProvider router={appRouter} />
  )
}
