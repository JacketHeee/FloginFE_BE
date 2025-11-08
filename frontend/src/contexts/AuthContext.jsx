import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

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
    // Verify token on app start
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken')
      
      if (token) {
        try {
          const result = await authService.verifyToken(token)
          
          if (result.valid) {
            setIsLoggedIn(true)
            setUser(result.user)
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
            setIsLoggedIn(false)
            setUser(null)
          }
        } catch (error) {
          console.error('Auth verification error:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          setIsLoggedIn(false)
          setUser(null)
        }
      }
      
      setLoading(false)
    }

    verifyAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials)
      
      if (result.success) {
        setIsLoggedIn(true)
        setUser(result.user)
        localStorage.setItem('authToken', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        setIsLoggedIn(true)
        setUser(result.user)
        localStorage.setItem('authToken', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, message: 'Đã xảy ra lỗi khi đăng ký' }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setIsLoggedIn(false)
      setUser(null)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return { success: true, message: 'Đăng xuất thành công' }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, message: 'Đã xảy ra lỗi khi đăng xuất' }
    }
  }

  const refreshAuth = async () => {
    const token = localStorage.getItem('authToken')
    
    if (token) {
      try {
        const result = await authService.refreshToken(token)
        
        if (result.success) {
          localStorage.setItem('authToken', result.token)
          return { success: true }
        }
      } catch (error) {
        console.error('Token refresh error:', error)
      }
    }
    
    return { success: false }
  }

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    register,
    logout,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}