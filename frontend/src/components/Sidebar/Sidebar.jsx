import { useState } from 'react';
import './Sidebar.scss';

const Sidebar = ({ activeMenu, onMenuChange }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    inventory: true,
    delivery: false,
    promotions: false,
    analytics: false,
    settings: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦',
      expandable: true,
      subItems: [
        { id: 'all-products', label: 'All Products', path: '/products' },
        { id: 'manage-categories', label: 'Manage Categories', path: '/categories' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🛒',
      path: '/orders'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      path: '/customers'
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: '🚚',
      expandable: true,
      subItems: []
    },
    {
      id: 'promotions',
      label: 'Promotions',
      icon: '🎁',
      expandable: true,
      subItems: []
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      expandable: true,
      subItems: []
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      expandable: true,
      subItems: []
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: '❓',
      path: '/help'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🛒</div>
          <span className="logo-text">Grocify</span>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="menu-section">
          <div className="menu-label">MAIN MENU</div>
          {menuItems.slice(0, 2).map(item => (
            <div key={item.id}>
              <div
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => item.expandable ? toggleMenu(item.id) : onMenuChange(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
                {item.expandable && (
                  <span className="expand-icon">{expandedMenus[item.id] ? '▼' : '▶'}</span>
                )}
              </div>
              {item.expandable && expandedMenus[item.id] && item.subItems && (
                <div className="submenu">
                  {item.subItems.map(subItem => (
                    <div
                      key={subItem.id}
                      className={`submenu-item ${activeMenu === subItem.id ? 'active' : ''}`}
                      onClick={() => onMenuChange(subItem.id)}
                    >
                      <span className="submenu-dot">•</span>
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="menu-section">
          <div className="menu-label">OPERATION & PROMOTION</div>
          {menuItems.slice(2, 7).map(item => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => item.expandable ? toggleMenu(item.id) : onMenuChange(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
              {item.expandable && (
                <span className="expand-icon">{expandedMenus[item.id] ? '▼' : '▶'}</span>
              )}
            </div>
          ))}
        </div>

        <div className="menu-section">
          <div className="menu-label">SETTING & SUPPORT</div>
          {menuItems.slice(7).map(item => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => onMenuChange(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="dark-mode-toggle">
          <span className="toggle-icon">🌙</span>
          <span className="toggle-text">Dark Mode</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
        <div className="user-profile">
          <img src="https://via.placeholder.com/40" alt="User" className="user-avatar" />
          <div className="user-info">
            <div className="user-name">Joseph Alpha</div>
            <div className="user-email">user@gmail.com</div>
          </div>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
