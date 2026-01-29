import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/notake-logo.svg';

interface SidebarProps {
  onLogout: () => void;
}

function Sidebar({ onLogout }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="NOTAKE" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard/profile" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="uil uil-user"></i>
          <span>Profile</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/notes" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="uil uil-notes"></i>
          <span>Notes</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/files" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="uil uil-folder"></i>
          <span>Files</span>
        </NavLink>
        
        <NavLink 
          to="/dashboard/board" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="uil uil-sitemap"></i>
          <span>Board</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={onLogout} className="nav-item logout-btn">
          <i className="uil uil-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
