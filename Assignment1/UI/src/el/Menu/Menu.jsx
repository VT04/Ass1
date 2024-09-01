import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { MenuData } from './MenuData';
import axios from '../../api/axios';
import './Menu.css';

function Menu() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/logout');

      if (response.status === 200) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FaBars onClick={toggleSidebar} />
        </Link>
      </div>
      <nav className={isSidebarOpen ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="close-bars">
              <AiOutlineClose onClick={toggleSidebar} />
            </Link>
          </li>
          {MenuData.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link
                to={item.path}
                onClick={item.title === 'Logout' ? handleLogout : undefined}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Menu;