import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    setLoading(false)
  }, [])

  const login = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    localStorage.setItem('isLoggedIn', 'true')
    // In real app, store token: localStorage.setItem('token', token)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('isLoggedIn')
    // In real app: localStorage.removeItem('token')
  }

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}