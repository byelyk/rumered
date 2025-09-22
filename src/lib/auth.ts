// Mock authentication system for development
// Replace with real StackAuth once properly configured

const createMockStackApp = () => ({
  getUser: async () => null,
  signIn: () => {
    console.log('Sign in clicked (mock)');
    // In a real app, this would redirect to StackAuth
    alert(
      'Sign in functionality will work once StackAuth is properly configured in the dashboard'
    );
  },
  signUp: () => {
    console.log('Sign up clicked (mock)');
    // In a real app, this would redirect to StackAuth
    alert(
      'Sign up functionality will work once StackAuth is properly configured in the dashboard'
    );
  },
  signOut: () => {
    console.log('Sign out clicked (mock)');
    // In a real app, this would clear the session
    alert(
      'Sign out functionality will work once StackAuth is properly configured in the dashboard'
    );
  },
  role: 'USER',
});

export const stackServerApp =
  createMockStackApp() as unknown as typeof StackServerApp;
