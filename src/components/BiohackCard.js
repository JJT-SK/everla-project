import React, { useState } from 'react';
import BiohackInfoCard from './BiohackInfoCard';
import './BiohackCard.css';

const BiohackCard = ({ hack, isFavourited, isSelected, onAddToProtocol, onToggleFavourite }) => {
  const [showInfoCard, setShowInfoCard] = useState(false);

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfoCard(true);
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
    <>
      <div className="biohack-card">
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
                title="View Details"
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
      </div>

      {/* Biohack Info Card Modal */}
      {showInfoCard && (
        <BiohackInfoCard 
          biohack={hack} 
          onClose={() => setShowInfoCard(false)}
          onAddToProtocol={onAddToProtocol}
          isFavourited={isFavourited}
          onToggleFavourite={onToggleFavourite}
        />
      )}
    </>
  );
};

export default BiohackCard; 