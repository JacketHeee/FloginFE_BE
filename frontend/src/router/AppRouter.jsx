import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { routes } from './routes'

// Lazy load components to avoid circular imports
import Register from '../pages/Register/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import Products from '../pages/Products/Products'
import Categories from '../pages/Categories/Categories'

const componentMap = {
  Register,
  Dashboard,
  Products,
  Categories
}

const AppRouter = () => {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.redirect) {
          const redirectTo = route.redirectTo(isLoggedIn)
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to={redirectTo} replace />}
            />
          )
        }

        const Component = componentMap[route.component]

        // Route không có children (như login)
        if (!route.children) {
          if (route.protected) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  isLoggedIn ? <Component /> : <Navigate to="/login" replace />
                }
              />
            )
          }

          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component />}
            />
          )
        }

        // Route có children (như Dashboard)
        if (route.protected) {
          return (
            <Route
              key={`dashboard-${index}`}
              path={route.path}
              element={
                isLoggedIn ? (
                  <Dashboard>
                    <Outlet />
                  </Dashboard>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              {route.children.map((child) => {
                const ChildComponent = componentMap[child.component]
                return (
                  <Route
                    key={child.path}
                    path={child.path}
                    element={<ChildComponent />}
                  />
                )
              })}
            </Route>
          )
        }

        return null
      })}
    </Routes>
  )
}

export default AppRouter