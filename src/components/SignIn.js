import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Enter your details to sign-in');
  const navigate = useNavigate();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedRememberMe && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('Enter your details to sign-in');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMessage('Please verify your email address before signing in.');
        } else if (error.message.includes('Auth session missing')) {
          setErrorMessage('Please enter your email and password to sign in.');
        } else if (error.message.includes('Too many requests')) {
          setErrorMessage('Too many sign-in attempts. Please wait a moment and try again.');
        } else {
          setErrorMessage('Unable to sign in. Please check your details and try again.');
        }
        return;
      }

      if (data.user) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }

        // Check if user exists in our custom tables, if not, create them
        try {
          console.log('=== DATA SYNC START ===');
          console.log('User ID:', data.user.id);
          console.log('User Email:', data.user.email);
          console.log('User Metadata:', data.user.user_metadata);
          
          // First, check if user exists in our users table
          console.log('Checking if user exists in users table...');
          const { error: userCheckError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userCheckError && userCheckError.code === 'PGRST116') {
            // User doesn't exist in our table, create them
            console.log('User not found in custom table, creating...');
            
            const userData = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.user_metadata?.username || email.split('@')[0],
              date_joined: new Date().toISOString()
            };
            
            console.log('Attempting to insert user data:', userData);
            
            const { error: userInsertError } = await supabase
              .from('users')
              .insert(userData);

            if (userInsertError) {
              console.error('❌ Error creating user in custom table:', userInsertError);
              console.error('Error details:', JSON.stringify(userInsertError, null, 2));
            } else {
              console.log('✅ User created in custom table successfully');
            }
          } else if (userCheckError) {
            console.error('❌ Error checking user in custom table:', userCheckError);
            console.error('Error details:', JSON.stringify(userCheckError, null, 2));
          } else {
            console.log('✅ User already exists in custom table');
          }

          // Always check if profile exists, regardless of user creation
          console.log('Checking if profile exists in user_profiles table...');
          const { error: profileCheckError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          if (profileCheckError && profileCheckError.code === 'PGRST116') {
            // Profile doesn't exist, create a default one
            console.log('Profile not found, creating default profile...');
            
            const profileData = {
              user_id: data.user.id,
              gender: 'Other',
              country: 'Unknown',
              dob: new Date('1990-01-01').toISOString()
            };
            
            console.log('Attempting to insert profile data:', profileData);
            
            const { error: profileInsertError } = await supabase
              .from('user_profiles')
              .insert(profileData);

            if (profileInsertError) {
              console.error('❌ Error creating profile:', profileInsertError);
              console.error('Error details:', JSON.stringify(profileInsertError, null, 2));
            } else {
              console.log('✅ Default profile created successfully');
            }
          } else if (profileCheckError) {
            console.error('❌ Error checking profile:', profileCheckError);
            console.error('Error details:', JSON.stringify(profileCheckError, null, 2));
          } else {
            console.log('✅ Profile already exists');
          }
          
          console.log('=== DATA SYNC COMPLETED ===');
        } catch (syncError) {
          console.error('❌ Error syncing user data:', syncError);
          console.error('Sync error details:', JSON.stringify(syncError, null, 2));
        }

        // Update last_login in the users table
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating last_login:', updateError);
          }
        } catch (updateError) {
          console.error('Error updating last_login:', updateError);
        }

        // Navigate to home page
        navigate('/home');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Welcome back</h1>
          <p className="signin-subtitle">{errorMessage}</p>
        </div>

        <form onSubmit={handleSignIn} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="signin-button"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="signin-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 