import { QueryProvider } from './providers/query-provider'
import { ThemeProvider } from './providers/theme-provider'
import Router from './routes'

function App() {

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryProvider>
        <Router />
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
