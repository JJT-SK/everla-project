import React from 'react';
import { createPortal } from 'react-dom';
import './BiohackInfoCard.css';

const BiohackInfoCard = ({ biohack, onClose, onAddToProtocol, isFavourited, onToggleFavourite }) => {
  if (!biohack) return null;

  // Helper function to format dosage string
  const formatDosage = () => {
    const { common_dosage_lower, common_dosage_upper, common_dosage_interval_unit } = biohack;
    
    if (!common_dosage_lower || !common_dosage_upper || !common_dosage_interval_unit) {
      return 'Dosage information not available';
    }

    if (common_dosage_lower === common_dosage_upper) {
      return `${common_dosage_lower}${common_dosage_interval_unit}`;
    } else {
      return `${common_dosage_lower}–${common_dosage_upper} ${common_dosage_interval_unit}`;
    }
  };

  // Helper function to format results timeline
  const formatResultsTimeline = () => {
    const { 
      results_timeline_lower, 
      results_timeline_upper, 
      results_timeline_small_interval_units,
      results_timeline_large_interval_units 
    } = biohack;

    if (!results_timeline_lower || !results_timeline_upper) {
      return 'Timeline information not available';
    }

    if (results_timeline_lower === results_timeline_upper) {
      return `${results_timeline_lower} ${results_timeline_small_interval_units || results_timeline_large_interval_units}`;
    } else {
      return `${results_timeline_lower}–${results_timeline_upper} ${results_timeline_small_interval_units || results_timeline_large_interval_units}`;
    }
  };

  // Helper function to get score bar color
  const getScoreColor = (score) => {
    if (score <= 1.5) return '#ff4757'; // Red
    if (score <= 3.5) return '#ffa502'; // Yellow/Amber
    return '#2ed573'; // Green
  };

  // Helper function to render score bar
  const renderScoreBar = (score, label) => {
    const percentage = (score / 5) * 100;
    const color = getScoreColor(score);

    return (
      <div className="score-bar-container">
        <div className="score-label">{label}</div>
        <div className="score-bar">
          <div 
            className="score-bar-fill" 
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: color 
            }}
          />
        </div>
        <div className="score-value">{score.toFixed(1)}/5</div>
      </div>
    );
  };

  // Helper function to render benefits/drawbacks
  const renderList = (items, emoji) => {
    return items
      .filter(item => item && item.trim() !== '')
      .map((item, index) => (
        <div key={index} className="list-item">
          <span className="list-emoji">{emoji}</span>
          <span className="list-text">{item}</span>
        </div>
      ));
  };

  const benefits = [
    biohack.advantage_1,
    biohack.advantage_2,
    biohack.advantage_3
  ].filter(Boolean);

  const drawbacks = [
    biohack.disadvantage_1,
    biohack.disadvantage_2,
    biohack.disadvantage_3
  ].filter(Boolean);

  const handleFavoriteClick = () => {
    if (onToggleFavourite) {
      onToggleFavourite(biohack.id);
    }
  };

  const handleAddToProtocol = () => {
    if (onAddToProtocol) {
      onAddToProtocol(biohack);
    }
  };

  const modalContent = (
    <div className="biohack-info-overlay" onClick={onClose}>
      <div className="biohack-info-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with title and action buttons */}
        <div className="info-card-header">
          <h2 className="info-card-title">{biohack.name}</h2>
          <div className="info-card-actions">
            <button className="info-card-favorite" onClick={handleFavoriteClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavourited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="info-card-add" onClick={handleAddToProtocol}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="info-card-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Image */}
        {biohack.image_url && (
          <div className="info-card-image">
            <img src={biohack.image_url} alt={biohack.name} />
          </div>
        )}

        {/* Description */}
        {biohack.description && (
          <div className="info-card-description">
            <p>{biohack.description}</p>
          </div>
        )}

        {/* Dosage & Results Timeline */}
        <div className="info-card-meta">
          <div className="meta-item">
            <span className="meta-label">Common Usage:</span>
            <span className="meta-value">{formatDosage()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Results Timeline:</span>
            <span className="meta-value">{formatResultsTimeline()}</span>
          </div>
        </div>

        {/* Benefits & Drawbacks */}
        {(benefits.length > 0 || drawbacks.length > 0) && (
          <div className="info-card-pros-cons">
            <div className="pros-cons-column">
              <h3 className="pros-cons-title">Potential Benefits</h3>
              <div className="pros-cons-list">
                {renderList(benefits, '✅')}
              </div>
            </div>
            <div className="pros-cons-column">
              <h3 className="pros-cons-title">Potential Drawbacks</h3>
              <div className="pros-cons-list">
                {renderList(drawbacks, '❌')}
              </div>
            </div>
          </div>
        )}

        {/* Score Bars */}
        <div className="info-card-scores">
          <div className="scores-container">
            {renderScoreBar(biohack.efficacy_score || 0, 'Effectiveness')}
            {renderScoreBar(biohack.difficulty_score || 0, 'Difficulty')}
            {renderScoreBar(biohack.time_investment_score || 0, 'Time Investment')}
            {renderScoreBar(biohack.cost_score || 0, 'Cost')}
          </div>
        </div>

        {/* Footer */}
        <div className="info-card-footer">
          <span className="footer-text">See Related Forum Posts</span>
        </div>
      </div>
    </div>
  );

  // Render the modal using a portal to the document body
  return createPortal(modalContent, document.body);
};

export default BiohackInfoCard; 