import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import TopNavigation from './TopNavigation';
import './ProtocolCatalogue.css';

function weightedAverage(protocol, key) {
  const biohacks = protocol.biohacks || [];
  if (!biohacks.length) return 0;
  const sum = biohacks.reduce((acc, b) => acc + (b[key] || 0), 0);
  return sum / biohacks.length;
}

function ProtocolCard({ protocol, expanded, selected, hovered, onExpand, onSelect, onMouseEnter, onMouseLeave }) {
  let borderClass = '';
  if (expanded && selected) borderClass = 'selected';
  else if (expanded && hovered) borderClass = 'hovered';
  else if (!expanded && selected) borderClass = 'selected';
  else if (!expanded && hovered) borderClass = 'hovered';

  if (!expanded) {
    // Collapsed: show only vertical name
    return (
      <div
        className={`protocol-card collapsed ${borderClass}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onExpand}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        style={{ justifyContent: 'center', alignItems: 'center', minWidth: '50px', maxWidth: '50px', padding: 0 }}
      >
        <div className="protocol-card-vertical-name">
          {protocol.name}
        </div>
      </div>
    );
  }
  // Expanded: show full details, allow selection
  return (
    <div
      className={`protocol-card expanded ${borderClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
    >
      <div className="protocol-card-header">
        <div className="protocol-card-title">{protocol.name}</div>
        <div className="protocol-card-description">{protocol.description}</div>
      </div>
      <div className="protocol-card-emojis">
        {(protocol.biohacks || []).map((b, i) => (
          <span key={b.id} className="protocol-emoji" style={{ gridColumn: (i % 2) + 1 }}>{b.emoji}</span>
        ))}
      </div>
      <div className="protocol-card-metrics">
        <MetricBar label="Efficacy" value={weightedAverage(protocol, 'efficacy_score')} />
        <MetricBar label="Difficulty" value={weightedAverage(protocol, 'difficulty_score')} />
        <MetricBar label="Time" value={weightedAverage(protocol, 'time_investment_score')} />
        <MetricBar label="Cost" value={weightedAverage(protocol, 'cost_score')} />
      </div>
    </div>
  );
}

function MetricBar({ label, value }) {
  // Use the same color logic as BiohackInfoCard
  const getScoreColor = (score) => {
    if (score <= 1.5) return '#ff4757'; // Red
    if (score <= 3.5) return '#ffa502'; // Yellow/Amber
    return '#2ed573'; // Green
  };
  const percentage = (value / 5) * 100;
  const color = getScoreColor(value);
  return (
    <div className="score-bar-container">
      <div className="score-label">{label}</div>
      <div className="score-bar">
        <div 
          className="score-bar-fill" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="score-value">{value.toFixed(1)}/5</div>
    </div>
  );
}

function ProtocolCarousel({ protocols, expandedIndex, selectedIndex, hoveredIndex, onExpand, onSelect, onMouseEnter, onMouseLeave, onPrev, onNext }) {
  // Show 3 at a time on desktop, 1 at a time on mobile
  // TODO: Responsive logic
  const visible = protocols.slice(0, 3);
  return (
    <div className="protocol-carousel">
      <button className="carousel-arrow left" onClick={onPrev}>&lt;</button>
      <div className="protocol-cards">
        {visible.map((protocol, i) => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            expanded={expandedIndex === i}
            selected={selectedIndex === i}
            hovered={hoveredIndex === i}
            onExpand={() => onExpand(i)}
            onSelect={() => onSelect(i)}
            onMouseEnter={() => onMouseEnter(i)}
            onMouseLeave={() => onMouseLeave(i)}
          />
        ))}
      </div>
      <button className="carousel-arrow right" onClick={onNext}>&gt;</button>
    </div>
  );
}

function ProtocolCatalogueActions({ onMyProtocols, onAdd, onAddAndActivate, disabled }) {
  return (
    <div className="protocol-catalogue-actions">
      <button onClick={onMyProtocols} disabled={disabled}>My Protocols</button>
      <button onClick={onAdd} disabled={disabled}>Add to Protocols</button>
      <button onClick={onAddAndActivate} disabled={disabled}>Add and Activate Protocol</button>
    </div>
  );
}

const ProtocolCatalogue = () => {
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const fetchProtocols = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get all admin user IDs
      const { data: admins, error: adminError } = await supabase
        .from('users')
        .select('id')
        .eq('admin_flag', 1);
      if (adminError) throw adminError;
      const adminIds = (admins || []).map(a => a.id);
      if (adminIds.length === 0) {
        setProtocols([]);
        setLoading(false);
        return;
      }
      // 2. Get all protocols where user_id is in adminIds
      const { data, error } = await supabase
        .from('protocols')
        .select(`
          *,
          protocol_hacks (
            hack_id,
            position
          )
        `)
        .in('user_id', adminIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProtocols(data || []);
    } catch (error) {
      console.error('Error fetching protocols:', error);
      setProtocols([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  const handleExpand = (i) => {
    setExpandedIndex(i);
  };
  const handleMouseEnter = (i) => {
    setHoveredIndex(i);
    if (selectedIndex !== null && selectedIndex !== i) {
      setSelectedIndex(null);
    }
  };
  const handleMouseLeave = (i) => {
    setHoveredIndex(null);
    // Do not clear selectedIndex here
  };
  const handleSelect = (i) => {
    setSelectedIndex(selectedIndex === i ? null : i);
  };
  const handlePrev = () => setExpandedIndex((i) => (i > 0 ? i - 1 : protocols.length - 1));
  const handleNext = () => setExpandedIndex((i) => (i < protocols.length - 1 ? i + 1 : 0));

  const handleAddAndActivate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to add protocols');
        return;
      }
      if (selectedIndex == null || !protocols[selectedIndex]) {
        alert('Please select a protocol to add and activate');
        return;
      }
      const selectedProtocol = protocols[selectedIndex];
      // Check if protocol name is unique for this user
      const { data: existingProtocols } = await supabase
        .from('protocols')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', selectedProtocol.name);
      if (existingProtocols && existingProtocols.length > 0) {
        alert('A protocol with this name already exists in your account');
        return;
      }
      // Insert protocol
      const { data: protocol, error: protocolError } = await supabase
        .from('protocols')
        .insert({
          user_id: user.id,
          name: selectedProtocol.name,
          description: selectedProtocol.description,
          status: 'active',
          created_at: new Date().toISOString(),
          activated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (protocolError) throw protocolError;
      // Insert protocol hacks
      const protocolHacks = (selectedProtocol.protocol_hacks || []).map((hack, index) => ({
        protocol_id: protocol.id,
        hack_id: hack.hack_id,
        position: index
      }));
      if (protocolHacks.length > 0) {
        const { error: hacksError } = await supabase
          .from('protocol_hacks')
          .insert(protocolHacks);
        if (hacksError) throw hacksError;
      }
      alert('Protocol added and activated!');
      // Optionally, navigate to user's protocols page
      // navigate('/protocols/my');
    } catch (error) {
      console.error('Error adding and activating protocol:', error);
      alert('Error adding and activating protocol. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="protocol-catalogue">
        <TopNavigation activePage="protocol-catalogue" />
        <div className="loading">Loading protocols...</div>
      </div>
    );
  }

  return (
    <div className="protocol-catalogue">
      <TopNavigation activePage="protocol-catalogue" />
      
      <div className="catalogue-content">
        <div className="catalogue-title" style={{ width: '100%', textAlign: 'center', fontWeight: 700, fontSize: '1.4rem', color: '#4a9eff', marginBottom: '2rem', letterSpacing: '0.01em' }}>
          Explore EVERLA-made protocols
        </div>
        {protocols.length === 0 ? (
          <div className="empty-state">
            <h2>No protocols yet</h2>
            <p>Create your first protocol to get started</p>
            <button 
              onClick={() => navigate('/protocols/create')}
              className="create-protocol-btn"
            >
              Create a Protocol
            </button>
          </div>
        ) : (
          <ProtocolCarousel
            protocols={protocols}
            expandedIndex={expandedIndex}
            selectedIndex={selectedIndex}
            hoveredIndex={hoveredIndex}
            onExpand={handleExpand}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
        <ProtocolCatalogueActions
          onMyProtocols={() => {}}
          onAdd={() => {}}
          onAddAndActivate={handleAddAndActivate}
          disabled={selectedIndex == null}
        />
      </div>
    </div>
  );
};

export default ProtocolCatalogue; 