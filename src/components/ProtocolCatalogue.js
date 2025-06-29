import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import TopNavigation from './TopNavigation';
import './ProtocolCatalogue.css';

const ProtocolCatalogue = () => {
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProtocols = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('protocols')
        .select(`
          *,
          protocol_hacks (
            hack_id,
            position
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProtocols(data || []);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

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
        <div className="catalogue-header">
          <h1>Protocol Catalogue</h1>
          <p>View and manage your saved protocols</p>
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
          <div className="protocols-grid">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="protocol-card">
                <div className="protocol-header">
                  <h3>{protocol.name}</h3>
                  <span className={`status ${protocol.status}`}>
                    {protocol.status}
                  </span>
                </div>
                <p className="protocol-description">{protocol.description}</p>
                <div className="protocol-meta">
                  <span>Created: {new Date(protocol.created_at).toLocaleDateString()}</span>
                  <span>{protocol.protocol_hacks?.length || 0} biohacks</span>
                </div>
                <div className="protocol-actions">
                  <button className="btn-view">View Details</button>
                  <button className="btn-edit">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolCatalogue; 