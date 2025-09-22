// Mock authentication utilities for development when StackAuth is not configured

export const useUser = () => {
  // Return null for development without StackAuth
  // This will be replaced with real StackAuth when properly configured
  return null;
};

export const useStackApp = () => ({
  signIn: () => console.log('Sign in clicked (mock)'),
  signUp: () => console.log('Sign up clicked (mock)'),
  signOut: () => console.log('Sign out clicked (mock)'),
});
