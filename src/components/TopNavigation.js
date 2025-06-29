import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNavigation.css';

const TopNavigation = ({ activePage = 'home' }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleNavClick = (page) => {
    switch (page) {
      case 'home':
        navigate('/home');
        break;
      case 'create-protocol':
        navigate('/protocols/create');
        break;
      case 'protocol-catalogue':
        navigate('/protocols/catalogue');
        break;
      case 'insights':
        navigate('/insights');
        break;
      default:
        break;
    }
  };

  return (
    <nav className="top-navigation">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo" onClick={handleLogoClick}>
            <img 
              src="https://zgiszibrpcfnixelehrp.supabase.co/storage/v1/object/public/testpublic/no background everla (just jelly) inverted.png"
              alt="Everla Logo"
              className="nav-logo-image"
            />
            <span className="nav-logo-text">EVERLA</span>
          </div>
          <div className="nav-buttons">
            <button 
              className={`nav-button ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              className={`nav-button ${activePage === 'create-protocol' ? 'active' : ''}`}
              onClick={() => handleNavClick('create-protocol')}
            >
              Create a Protocol
            </button>
            <button 
              className={`nav-button ${activePage === 'protocol-catalogue' ? 'active' : ''}`}
              onClick={() => handleNavClick('protocol-catalogue')}
            >
              Protocol Catalogue
            </button>
            <button 
              className={`nav-button ${activePage === 'insights' ? 'active' : ''}`}
              onClick={() => handleNavClick('insights')}
            >
              Insights
            </button>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="nav-icon" title="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          <button className="nav-icon" title="Checklist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </button>
          
          <button className="nav-icon" title="Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          
          <button className="nav-icon" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
          </button>
          
          <button className="nav-icon profile-icon" title="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation; 