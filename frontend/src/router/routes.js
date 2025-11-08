// Route definitions
export const routes = [
  {
    path: '/',
    redirect: true,
    redirectTo: (isLoggedIn) => isLoggedIn ? '/products' : '/login'
  },
  {
    path: '/login',
    component: 'Register',
    protected: false,
    title: 'Đăng nhập'
  },
  {
    path: '/',
    component: 'Dashboard',
    protected: true,
    children: [
      {
        path: 'products',
        component: 'Products',
        title: 'Quản lý sản phẩm'
      },
      {
        path: 'categories',
        component: 'Categories',
        title: 'Quản lý thể loại'
      }
    ]
  }
]

// Route helpers
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path)
}

export const isProtectedRoute = (path) => {
  const route = getRouteByPath(path)
  return route ? route.protected : false
}

export const getRouteTitle = (path) => {
  const route = getRouteByPath(path)
  return route ? route.title : 'App'
}