import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    day: '1',
    month: '1',
    year: '2000',
    country: '',
    agreeToTerms: false
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Countries list
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Generate days, months, years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
    { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  // Password validation
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
        
      case 'username':
        if (!value) {
          errors.username = 'Username is required';
        } else if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete errors.username;
        }
        break;
        
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (!passwordValidation.length || !passwordValidation.uppercase || 
                   !passwordValidation.lowercase || !passwordValidation.number || 
                   !passwordValidation.special) {
          errors.password = 'Password does not meet requirements';
        } else {
          delete errors.password;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
        
      case 'gender':
        if (!value) {
          errors.gender = 'Please select a gender';
        } else {
          delete errors.gender;
        }
        break;
        
      case 'country':
        if (!value) {
          errors.country = 'Please select a country';
        } else {
          delete errors.country;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    setErrorMessage('');
  };

  const checkUniqueEmail = async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    return !data; // Return true if email is unique (no data found)
  };

  const checkUniqueUsername = async (username) => {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();
    
    return !data; // Return true if username is unique (no data found)
  };

  const validateAge = () => {
    const birthDate = new Date(
      parseInt(formData.year),
      parseInt(formData.month) - 1,
      parseInt(formData.day)
    );
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate all fields
      const requiredFields = ['email', 'username', 'password', 'confirmPassword', 'gender', 'country'];
      const errors = {};
      
      requiredFields.forEach(field => {
        validateField(field, formData[field]);
      });

      if (Object.keys(fieldErrors).length > 0) {
        setErrorMessage('Please fix the errors above');
        setIsLoading(false);
        return;
      }

      // Check age requirement
      const age = validateAge();
      if (age < 13) {
        setErrorMessage('You must be at least 13 years old to create an account');
        setIsLoading(false);
        return;
      }

      // Check terms agreement
      if (!formData.agreeToTerms) {
        setErrorMessage('You must agree to the terms and conditions');
        setIsLoading(false);
        return;
      }

      // Check unique email and username
      const isEmailUnique = await checkUniqueEmail(formData.email);
      const isUsernameUnique = await checkUniqueUsername(formData.username);

      if (!isEmailUnique) {
        setErrorMessage('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      if (!isUsernameUnique) {
        setErrorMessage('This username is already taken');
        setIsLoading(false);
        return;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          setErrorMessage('An account with this email already exists.');
        } else if (authError.message.includes('Password should be at least')) {
          setErrorMessage('Password must be at least 6 characters long.');
        } else if (authError.message.includes('Invalid email')) {
          setErrorMessage('Please enter a valid email address.');
        } else {
          setErrorMessage('Unable to create account. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Check if email confirmation is required
        if (!authData.user.email_confirmed_at) {
          setSuccessMessage('Account created successfully! Please check your email to verify your account before signing in.');
          
          // Redirect to sign-in page after 5 seconds
          setTimeout(() => {
            navigate('/');
          }, 5000);
          setIsLoading(false);
          return;
        }

        // If email is already confirmed, proceed with database insertion
        try {
          // Insert into users table
          const { error: userError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              username: formData.username,
              date_joined: new Date().toISOString()
            });

          if (userError) {
            console.error('Error inserting into users table:', userError);
            // Don't fail the signup, just log the error
          }

          // Insert into user_profiles table
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: authData.user.id,
              gender: formData.gender,
              country: formData.country,
              dob: new Date(
                parseInt(formData.year),
                parseInt(formData.month) - 1,
                parseInt(formData.day)
              ).toISOString()
            });

          if (profileError) {
            console.error('Error inserting into user_profiles table:', profileError);
            // Don't fail the signup, just log the error
          }

          setSuccessMessage('Account created successfully! You can now sign in.');
          
          // Redirect to sign-in page after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } catch (dbError) {
          console.error('Database insertion error:', dbError);
          setSuccessMessage('Account created successfully! You can now sign in.');
          
          // Redirect to sign-in page after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      }

    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Logo and Brand */}
        <div className="brand-section">
          <div className="logo">
            <img src="/logo.jpeg" alt="Everla Logo" className="logo-image" />
          </div>
        </div>

        {/* Header */}
        <div className="signup-header">
          <h2>Create your account</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`form-input ${fieldErrors.email ? 'error' : ''}`}
            />
            {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your username"
              className={`form-input ${fieldErrors.username ? 'error' : ''}`}
            />
            {fieldErrors.username && <span className="error-message">{fieldErrors.username}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter a password"
              className={`form-input ${fieldErrors.password ? 'error' : ''}`}
            />
            {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
            
            {/* Password validation */}
            <div className="password-validation">
              <div className={`validation-item ${passwordValidation.length ? 'valid' : ''}`}>
                ✓ At least 8 characters
              </div>
              <div className={`validation-item ${passwordValidation.uppercase ? 'valid' : ''}`}>
                ✓ One uppercase letter
              </div>
              <div className={`validation-item ${passwordValidation.lowercase ? 'valid' : ''}`}>
                ✓ One lowercase letter
              </div>
              <div className={`validation-item ${passwordValidation.number ? 'valid' : ''}`}>
                ✓ One number
              </div>
              <div className={`validation-item ${passwordValidation.special ? 'valid' : ''}`}>
                ✓ One special character
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
            />
            {fieldErrors.confirmPassword && <span className="error-message">{fieldErrors.confirmPassword}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <div className="gender-buttons">
              {['Male', 'Female', 'Other'].map(gender => (
                <button
                  key={gender}
                  type="button"
                  className={`gender-button ${formData.gender === gender ? 'selected' : ''}`}
                  onClick={() => handleInputChange('gender', gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
            {fieldErrors.gender && <span className="error-message">{fieldErrors.gender}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth</label>
            <div className="dob-selectors">
              <select
                value={formData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
                className="dob-select"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                className="dob-select"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <select
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="dob-select"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="country">Country of Residence</label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={`form-input ${fieldErrors.country ? 'error' : ''}`}
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {fieldErrors.country && <span className="error-message">{fieldErrors.country}</span>}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              <span className="terms-text">
                Agree to our{' '}
                <button
                  type="button"
                  className="terms-link"
                  onClick={() => setShowTermsModal(true)}
                >
                  terms and conditions
                </button>
              </span>
            </label>
          </div>

          {/* Error and Success Messages */}
          {errorMessage && <div className="error-banner">{errorMessage}</div>}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="signup-button"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="signup-footer">
          <p>
            Have an account?{' '}
            <Link to="/" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Terms and Conditions</h3>
              <button
                className="modal-close"
                onClick={() => setShowTermsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <h4>1. Acceptance of Terms</h4>
              <p>By accessing and using Everla, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h4>2. Use License</h4>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on Everla's website for personal, non-commercial transitory viewing only.</p>
              
              <h4>3. Disclaimer</h4>
              <p>The materials on Everla's website are provided on an 'as is' basis. Everla makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              
              <h4>4. Limitations</h4>
              <p>In no event shall Everla or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Everla's website.</p>
              
              <h4>5. Privacy Policy</h4>
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
              
              <h4>6. Account Security</h4>
              <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
              
              <h4>7. Termination</h4>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              
              <h4>8. Changes to Terms</h4>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button"
                onClick={() => setShowTermsModal(false)}
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;