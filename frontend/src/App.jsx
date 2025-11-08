import { useState } from 'react';
import './App.scss';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductList from './pages/ProductList/ProductList';

function App() {
  const [currentPage, setCurrentPage] = useState('auth'); // 'auth' or 'dashboard'
  console.log("Current page:", currentPage);

  return (
    <div className="app">
      {currentPage === 'auth' ? (
        <Register onLoginSuccess={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard>
          <ProductList />
        </Dashboard>
      )}
    </div>
  );
}

export default App;
