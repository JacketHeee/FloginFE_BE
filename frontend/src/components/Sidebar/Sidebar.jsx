import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.scss';
import Devider from '../Devider/Devider';
import user from "../../assets/user.jpg"
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate active menu based on current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path === '/products') return 'products';
    if (path === '/categories') return 'categories';
    if (path === '/setting') return 'products';
    if (path === '/help') return 'products';
    return 'products'; // default
  };

  const activeMenu = getActiveMenu();
  const [expandedMenus, setExpandedMenus] = useState({
    inventory: true,
    delivery: false,
    promotions: false,
    analytics: false,
    settings: false
  });
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems = [
    {
      id: "main_menu",
      label: 'MENU',
      subItems: [
        // {
        //   id: 'dashboard',
        //   label: 'Dashboard',
        //   icon: 
        //     <Icon> 
        //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        //         <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        //       </svg>
        //     </Icon>,
        //   path: '/dashboard'
        // },
        {
          id: 'inventory',
          label: 'Hàng hóa',
          icon: 
            <Icon> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M1.5 9.832v1.793c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.832a3 3 0 0 0-.722-1.952l-3.285-3.832A3 3 0 0 0 16.215 3h-8.43a3 3 0 0 0-2.278 1.048L2.222 7.88A3 3 0 0 0 1.5 9.832ZM7.785 4.5a1.5 1.5 0 0 0-1.139.524L3.881 8.25h3.165a3 3 0 0 1 2.496 1.336l.164.246a1.5 1.5 0 0 0 1.248.668h2.092a1.5 1.5 0 0 0 1.248-.668l.164-.246a3 3 0 0 1 2.496-1.336h3.165l-2.765-3.226a1.5 1.5 0 0 0-1.139-.524h-8.43Z" clipRule="evenodd" />
                <path d="M2.813 15c-.725 0-1.313.588-1.313 1.313V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-1.688c0-.724-.588-1.312-1.313-1.312h-4.233a3 3 0 0 0-2.496 1.336l-.164.246a1.5 1.5 0 0 1-1.248.668h-2.092a1.5 1.5 0 0 1-1.248-.668l-.164-.246A3 3 0 0 0 7.046 15H2.812Z" />
              </svg>
            </Icon>,
          expandable: true,
          subItems: [
            { 
              id: 'products', 
              label: 'Sản phẩm', 
              path: '/products' 
            },
            { 
              id: 'categories', 
              label: 'Thể loại', 
              path: '/categories' 
            }
          ]
        },
      ]
    },
    {
      id: "setting_help",
      label: 'CÀI ĐẶT & HỖ TRỢ',
      subItems: [
        {
          id: 'settings',
          label: 'Cài đặt',
          icon: 
          <Icon> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </Icon>,
          path: "/products"
        },
        {
          id: 'help',
          label: 'Hỗ trợ',
          icon: 
          <Icon> 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </Icon>,
          path: '/products'
        }
      ]
    }
  ];

  const {logout} = useAuth();

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutPopup(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🛒</div>
          <span className="logo-text">LANNM</span>
        </div>
      </div>

     <Devider/>

      <div className="sidebar-content">
        {
          menuItems.map(item => (
            <div className="menu-section" key={item.id} >
              <div className="menu-label">{item.label}</div>
              {item.subItems.map(item => (
                <div key={item.id}>
                  <div className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      }
                      if (item.expandable)  
                        toggleMenu(item.id)
                    }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                    {item.expandable && (
                      <Icon>
                        {expandedMenus[item.id] ? 
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                          :
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        } 
                      </Icon>
                    )}
                  </div>
                  {item.expandable && expandedMenus[item.id] && item.subItems && (
                    <div className="submenu">
                      {item.subItems.map(subItem => (
                        <div key={subItem.id} className={`submenu-item ${activeMenu === subItem.id ? 'active' : ''}`}
                          onClick={() => navigate(subItem.path)}
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
            )
          )
        }
        
      </div>

      <div className="sidebar-footer">
        {/* <div className="dark-mode-toggle">
          <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          </Icon>

          <span className="toggle-text">Dark Mode</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div> */}

        <div className="user-profile">
          <img src={user} alt="User" className="user-avatar" />
          <div className="user-info">
            <div className="user-name">Joseph Alpha</div>
            <div className="user-email">user@gmail.com</div>
          </div>
          
          <Button onClick={handleLogoutClick}>
            <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            </Icon>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup-overlay" onClick={cancelLogout}>
          <div className="logout-popup" onClick={(e) => e.stopPropagation()}>
            <div className="logout-popup-header">
              <Icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>

              </Icon>
              <h3>Xác nhận đăng xuất</h3>
            </div>
            <div className="logout-popup-body">
              <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
            </div>
            <div className="logout-popup-footer">
              <Button className="btn-cancel" onClick={cancelLogout}>
                Hủy
              </Button>
              <Button className="btn-confirm" onClick={confirmLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Sidebar;
