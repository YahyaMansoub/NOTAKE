import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import authService from '../services/authService';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
