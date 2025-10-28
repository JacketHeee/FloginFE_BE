import { useState } from 'react';
import './ProductList.scss';

const ProductList = () => {
  const [products] = useState([
    {
      id: 'GR47',
      name: 'Pure Organic Orange',
      image: '🍊',
      price: 48.00,
      view: 12700,
      click: '85%',
      quantity: 8650,
      revenue: 35750,
      status: 'Active'
    },
    {
      id: 'GR46',
      name: 'Fresh Peaches Plus',
      image: '🍑',
      price: 34.00,
      view: 11500,
      click: '70%',
      quantity: 6500,
      revenue: 24800,
      status: 'Active'
    },
    {
      id: 'GR45',
      name: 'Organic Bananas',
      image: '🍌',
      price: 42.00,
      view: 9350,
      click: '65%',
      quantity: 4100,
      revenue: 20900,
      status: 'Active'
    },
    {
      id: 'GR44',
      name: 'Ripe Mango Delight',
      image: '🥭',
      price: 39.00,
      view: 8500,
      click: '60%',
      quantity: 3800,
      revenue: 14820,
      status: 'Active'
    },
    {
      id: 'GR43',
      name: 'Fresh Strawberry Bliss',
      image: '🍓',
      price: 36.00,
      view: 7900,
      click: '58%',
      quantity: 3600,
      revenue: 12960,
      status: 'Active'
    },
    {
      id: 'GR42',
      name: 'Sweet Grape Delight',
      image: '🍇',
      price: 49.00,
      view: 10200,
      click: '62%',
      quantity: 4000,
      revenue: 19600,
      status: 'Active'
    },
    {
      id: 'GR41',
      name: 'Tropical Pineapple Fresh',
      image: '🍍',
      price: 42.00,
      view: 9300,
      click: '64%',
      quantity: 3900,
      revenue: 16380,
      status: 'Active'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="product-list-page">
      <div className="page-header">
        <div className="header-banner">
          <div className="banner-content">
            <h2>AI User Reports for Better Control</h2>
            <p>Get detailed user reports with one click.</p>
          </div>
          <button className="generate-button">
            ✨ Generate Auto Reports
          </button>
        </div>
      </div>

      <div className="product-list-container">
        <div className="list-header">
          <h2>Product Lists</h2>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Type product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="filter-button">
              🔧 Filter
            </button>
            <button className="add-button">
              + Add Products
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Product Name ▼</th>
                <th>Price ▼</th>
                <th>View ▼</th>
                <th>Click ▼</th>
                <th>Quantity ▼</th>
                <th>Revenue ▼</th>
                <th>Status ▼</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="product-info">
                      <span className="product-image">{product.image}</span>
                      <div>
                        <div className="product-name">{product.name}</div>
                        <div className="product-id">Txn ID: #{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.view.toLocaleString()}</td>
                  <td>{product.click}</td>
                  <td>{product.quantity.toLocaleString()}</td>
                  <td>${product.revenue.toLocaleString()}</td>
                  <td>
                    <span className="status-badge active">
                      ● {product.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-button">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="page-info">100 Pages</div>
          <div className="pagination">
            <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
              <option value={1}>Page 1</option>
              <option value={2}>Page 2</option>
              <option value={3}>Page 3</option>
            </select>
            <button className="pagination-button" disabled={currentPage === 1}>
              &lt;
            </button>
            <button className="pagination-button pagination-next">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
