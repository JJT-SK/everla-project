import React, { useState, useEffect } from 'react';
import './ProtocolBuilder.css';

const ProtocolBuilder = ({ selectedHacks, onRemoveHack, onSaveProtocol, onNavigateToMyProtocols }) => {
  const [protocolName, setProtocolName] = useState('');
  const [protocolDescription, setProtocolDescription] = useState('');
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Function to convert long names to initials
  const getDisplayName = (name) => {
    if (name.length <= 8) return name;
    
    // Split name into words and get first letter of each
    const words = name.split(' ');
    if (words.length === 1) {
      // Single word longer than 8 chars - take first 3 letters
      return name.substring(0, 3).toUpperCase();
    }
    
    // Multiple words - take first letter of each word
    const initials = words.map(word => word.charAt(0)).join('');
    return initials.toUpperCase();
  };

  // Calculate weighted average scores (out of 5)
  const calculateWeightedAverageScore = (field) => {
    if (selectedHacks.length === 0) return 0;
    
    // Calculate total weight (could be based on hack importance, for now equal weight)
    const totalWeight = selectedHacks.length;
    
    // Calculate weighted sum
    const weightedSum = selectedHacks.reduce((acc, hack) => {
      // Get the score (already on 0-5 scale)
      const score = hack[field] || 0;
      
      // Add to weighted sum (no conversion needed since already 0-5)
      return acc + score;
    }, 0);
    
    // Return weighted average
    const result = Math.round((weightedSum / totalWeight) * 10) / 10; // Round to 1 decimal place
    return result;
  };

  const effectivenessScore = calculateWeightedAverageScore('efficacy_score');
  const difficultyScore = calculateWeightedAverageScore('difficulty_score');
  const timeInvestmentScore = calculateWeightedAverageScore('time_investment_score');
  const costScore = calculateWeightedAverageScore('cost_score');

  // Check if scroll indicator should be shown
  useEffect(() => {
    const container = document.querySelector('.selected-hacks-container');
    if (container) {
      setShowScrollIndicator(container.scrollWidth > container.clientWidth);
    }
  }, [selectedHacks]);

  const handleSave = (activated = false) => {
    if (!protocolName.trim()) {
      alert('Please enter a protocol name');
      return;
    }

    if (selectedHacks.length === 0) {
      alert('Please select at least one biohack for your protocol');
      return;
    }

    onSaveProtocol({
      name: protocolName.trim(),
      description: protocolDescription.trim(),
      activated
    });
  };

  const handleSaveProtocol = () => handleSave(false);
  const handleSaveAndActivate = () => handleSave(true);

  return (
    <div className="protocol-builder">
      <div className="builder-content">
        <div className="builder-main-row">
          {/* Form Inputs - Top Left */}
          <div className="form-inputs">
            <input
              type="text"
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              placeholder="Your Protocol Name"
              maxLength={100}
            />
            <textarea
              value={protocolDescription}
              onChange={(e) => setProtocolDescription(e.target.value)}
              placeholder="Description (Optional)"
              maxLength={500}
            />
          </div>

          {/* Selected Hacks - Central Focus */}
          <div className="selected-hacks-section">
            <div className="selected-hacks-container">
              {selectedHacks.map((hack, index) => (
                <div key={hack.id} className="selected-hack-slot">
                  <img 
                    src={hack.image_url || '/default-biohack.jpg'} 
                    alt={hack.name}
                    onError={(e) => {
                      e.target.src = '/default-biohack.jpg';
                    }}
                  />
                  <span className="hack-name" title={hack.name}>
                    {getDisplayName(hack.name)}
                  </span>
                  <button 
                    className="remove-hack"
                    onClick={() => onRemoveHack(hack.id)}
                    title="Remove from protocol"
                  >
                    −
                  </button>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 8 - selectedHacks.length }, (_, index) => (
                <div key={`empty-${index}`} className="selected-hack-slot empty-slot">
                  <div className="empty-placeholder">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                    <span>Add</span>
                  </div>
                </div>
              ))}
            </div>
            
            {showScrollIndicator && (
              <div className="scroll-indicator">
                ➔
              </div>
            )}
          </div>

          {/* Score Indicators - Right Side */}
          <div className="right-side-container">
            <div className="score-indicators">
              <div className="score-item">
                <span>Efficacy</span>
                <div className="protocol-score-bar">
                  <div className="protocol-score-fill effectiveness" style={{ width: `${(effectivenessScore / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <span>Difficulty</span>
                <div className="protocol-score-bar">
                  <div className="protocol-score-fill difficulty" style={{ width: `${(difficultyScore / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <span>Time</span>
                <div className="protocol-score-bar">
                  <div className="protocol-score-fill time" style={{ width: `${(timeInvestmentScore / 5) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <span>Cost</span>
                <div className="protocol-score-bar">
                  <div className="protocol-score-fill cost" style={{ width: `${(costScore / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Right Section */}
            <div className="action-buttons">
              <button 
                className="btn-secondary"
                onClick={onNavigateToMyProtocols}
              >
                My Protocols
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveProtocol}
                disabled={selectedHacks.length === 0}
              >
                Create
              </button>
              <button 
                className="btn-primary btn-activate"
                onClick={handleSaveAndActivate}
                disabled={selectedHacks.length === 0}
              >
                Create and Activate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolBuilder; 