import { useAuth } from './contexts/AuthContext'
import AppRouter from './router/AppRouter'
import './App.scss'

function App() {
  const { loading } = useAuth()

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="App">
      <AppRouter />
    </div>
  )
}

export default App
