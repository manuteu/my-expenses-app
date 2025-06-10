import { QueryProvider } from './providers/query-provider'
import { ThemeProvider } from './providers/theme-provider'
import Router from './routes'

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="local_storage_theme">
      <QueryProvider>
        <Router />
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
