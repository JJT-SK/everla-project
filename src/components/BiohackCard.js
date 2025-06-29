import React, { useState } from 'react';
import './BiohackCard.css';

const BiohackCard = ({ hack, isFavourited, isSelected, onAddToProtocol, onToggleFavourite }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleInfoClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToProtocol(hack);
  };

  const handleFavouriteClick = (e) => {
    e.stopPropagation();
    onToggleFavourite(hack.id);
  };

  return (
    <div className="biohack-card" onMouseLeave={handleMouseLeave}>
      <div className="card-image">
        <img 
          src={hack.image_url || '/default-biohack.jpg'} 
          alt={hack.name}
          onError={(e) => {
            e.target.src = '/default-biohack.jpg';
          }}
        />
        <div className="card-overlay">
          <div className="hover-icons">
            <button 
              className="hover-icon info-icon"
              onClick={handleInfoClick}
              title="Info"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </button>
            
            <button 
              className={`hover-icon favourite-icon ${isFavourited ? 'active' : ''}`}
              onClick={handleFavouriteClick}
              title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavourited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            
            <button 
              className={`hover-icon add-icon ${isSelected ? 'selected' : ''}`}
              onClick={handleAddClick}
              title={isSelected ? 'Already in protocol' : 'Add to protocol'}
              disabled={isSelected}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{hack.name}</h3>
      </div>

      {/* Info Tooltip */}
      {showTooltip && (
        <div 
          className="info-tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="tooltip-header">
            <h4>{hack.name}</h4>
            <button 
              className="tooltip-close"
              onClick={() => setShowTooltip(false)}
            >
              ×
            </button>
          </div>
          <div className="tooltip-content">
            <p className="tooltip-description">{hack.description}</p>
            <div className="tooltip-details">
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{hack.category || 'Uncategorized'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time Investment:</span>
                <span className="detail-value">{hack.time_investment_score || 0}/100</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cost:</span>
                <span className="detail-value">{hack.cost_score || 0}/100</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiohackCard; 