// Environment configuration helper
// All environment variables must be prefixed with VITE_ to be accessible in the browser

const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // Application Branding
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MyBlog',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Welcome to MyBlog',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Discover amazing articles and stories from our community',
  APP_COPYRIGHT: import.meta.env.VITE_APP_COPYRIGHT || '© 2026 MyBlog. All rights reserved.',

  // Pagination Settings
  POSTS_PER_PAGE_HOME: parseInt(import.meta.env.VITE_POSTS_PER_PAGE_HOME) || 12,
  POSTS_PER_PAGE_DASHBOARD: parseInt(import.meta.env.VITE_POSTS_PER_PAGE_DASHBOARD) || 9,
  POSTS_PER_PAGE_TRASH: parseInt(import.meta.env.VITE_POSTS_PER_PAGE_TRASH) || 9,
  PAGINATION_MAX_PER_PAGE: parseInt(import.meta.env.VITE_PAGINATION_MAX_PER_PAGE) || 100,

  // Content Settings
  POST_PREVIEW_LENGTH_SHORT: parseInt(import.meta.env.VITE_POST_PREVIEW_LENGTH_SHORT) || 120,
  POST_PREVIEW_LENGTH_LONG: parseInt(import.meta.env.VITE_POST_PREVIEW_LENGTH_LONG) || 200,
  POST_MIN_CONTENT_LENGTH: parseInt(import.meta.env.VITE_POST_MIN_CONTENT_LENGTH) || 50,

  // UI Timers
  ALERT_SUCCESS_TIMER: parseInt(import.meta.env.VITE_ALERT_SUCCESS_TIMER) || 3000,
  ALERT_ERROR_TIMER: parseInt(import.meta.env.VITE_ALERT_ERROR_TIMER) || 4000,
  ALERT_INFO_TIMER: parseInt(import.meta.env.VITE_ALERT_INFO_TIMER) || 3000,

  // Feature Flags
  ENABLE_REGISTRATION: import.meta.env.VITE_ENABLE_REGISTRATION === 'true',
  ENABLE_COMMENTS: import.meta.env.VITE_ENABLE_COMMENTS === 'true',
  ENABLE_LIKES: import.meta.env.VITE_ENABLE_LIKES === 'true',

  // Development Settings
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'error',
  
  // Environment info
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Validation function to check required environment variables
export const validateEnv = () => {
  const required = ['API_BASE_URL', 'APP_NAME'];
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Log configuration in development
if (env.DEBUG_MODE && env.IS_DEVELOPMENT) {
  console.log('Environment Configuration:', env);
}

export default env;