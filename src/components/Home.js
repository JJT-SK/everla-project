import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import TopNavigation from './TopNavigation';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/');
        } else if (session?.user) {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="home-container">
        <TopNavigation activePage="home" />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <TopNavigation activePage="home" />
      
      <div className="home-content">
        <div className="home-header">
          <h1>Welcome to Everla</h1>
          <p>You've successfully signed in to your account.</p>
        </div>
        
        <div className="user-info">
          <h2>Account Information</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Last Sign In:</strong> {new Date(user?.last_sign_in_at).toLocaleString()}</p>
        </div>

        <div className="action-buttons">
          <button 
            onClick={() => navigate('/protocols/create')} 
            className="primary-button"
          >
            Create a Protocol
          </button>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 