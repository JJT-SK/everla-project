# Everla App

A modern React application with Supabase authentication, featuring a minimalist design inspired by Apple's design language.

## Features

- **Sign In Page**: Clean, modern authentication interface
- **Sign Up Page**: Comprehensive user registration with validation
- **Supabase Integration**: Secure user authentication and data storage
- **Remember Me**: Local storage for saved credentials
- **Real-time Password Validation**: Visual feedback for password requirements
- **Terms and Conditions Modal**: Popup with comprehensive terms
- **Age Verification**: Minimum 13+ years old requirement
- **Unique Username/Email Validation**: Prevents duplicate accounts
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages
- **Protected Routes**: Automatic redirection for unauthenticated users

## Design System

- **Primary Background**: Navy (#0A1D37)
- **Typography**: Inter font family
- **Color Scheme**: White, light gray, and navy accents
- **Style**: Minimalist and product-focused, inspired by Apple's design language

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── SignIn.js          # Sign-in page component
│   ├── SignIn.css         # Sign-in page styles
│   ├── SignUp.js          # Sign-up page component
│   ├── SignUp.css         # Sign-up page styles
│   ├── Home.js            # Home page component
│   └── Home.css           # Home page styles
├── supabase.js            # Supabase client configuration
├── App.js                 # Main app component with routing
├── index.js               # Application entry point
└── index.css              # Global styles
```

## Authentication Flow

### Sign In
1. Users enter their email and password on the sign-in page
2. Credentials are validated against Supabase authentication
3. On successful authentication, users are redirected to the home page
4. The `last_login` field in the users table is updated
5. "Remember me" functionality saves credentials to localStorage

### Sign Up
1. Users fill out the comprehensive registration form
2. Real-time password validation provides immediate feedback
3. Email and username uniqueness are verified
4. Age verification ensures users are 13+ years old
5. Terms and conditions must be agreed to
6. User is created in Supabase Auth and both database tables
7. Success message and redirect to sign-in page

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Database Schema

The application uses two tables:

### `users` table:
- `id` (UUID) - Primary key, matches Supabase Auth user ID
- `email` (string) - User's email address
- `password_hash` (string) - Hashed password (managed by Supabase Auth)
- `username` (string) - Unique username
- `date_joined` (timestamp) - Account creation date
- `last_login` (timestamp) - Last sign-in date

### `user_profiles` table:
- `user_id` (UUID) - Foreign key to users table
- `gender` (string) - User's gender selection
- `country` (string) - User's country of residence
- `dob` (timestamp) - User's date of birth

## Form Validation

- **Email**: Valid email format and uniqueness check
- **Username**: 3+ characters, alphanumeric + underscores only, uniqueness check
- **Password**: Real-time validation with visual feedback
- **Age**: Minimum 13 years old requirement
- **Required Fields**: All form fields are required
- **Terms Agreement**: Must be checked to proceed

## Security Notes

- The Supabase API key is stored in the client-side code for this demo
- In production, consider using environment variables and proper security measures
- The API key provided is for demonstration purposes only
- Password validation follows industry standards
- Age verification prevents underage registrations

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (one-way operation) 