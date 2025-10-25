import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../Style/header.css';
import '../media/header-media.css';
import headerImage from "../../assets/header-img.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(true); 
  const navigate = useNavigate(); // ✅ Initialize navigate

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // ✅ Logout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/admin/login');
  };

  return (
    <div className='container-header'>
      <div className='header'>
        <div className='header-img'>
          <img src={headerImage} alt="Header-img" />
        </div>

        <div className='bg-header'>
          <div className='header-left'>
            {menuOpen && (
              <ul className='header-nav'>
                <li><a href="/admin/pages/dashboard">Dashboard</a></li>
                <li><a href="/admin/pages/inventory">Inventory</a></li>
                <li><a href="/admin/pages/alerts">Alerts</a></li>
                <li><a href="/admin/pages/suppliers">Suppliers</a></li>
              </ul>
            )}
          </div>

          <div className='header-right'>
            <div className='menu-btn'>
              <button
                type='button'
                className='menus'
                onClick={toggleMenu}>
                ☰
              </button>
            </div>
            <div className='header-r header-right'>
              <h3 className='username'>Hello, Rana!</h3>
            </div>
            <div className='h-btn'>
              <button 
                type='button' 
                className='header-btn'
                onClick={handleLogout} // ✅ Add onClick handler
              >
                Log Out
              </button>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;