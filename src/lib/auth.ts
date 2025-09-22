import { StackServerApp } from '@stackframe/stack';

// Create a mock StackAuth app for development when env vars are missing
const createMockStackApp = () => ({
  getUser: async () => null,
  signIn: () => console.log('Sign in clicked'),
  signUp: () => console.log('Sign up clicked'),
  signOut: () => console.log('Sign out clicked'),
  role: 'USER',
});

export const stackServerApp = process.env.STACKAUTH_API_KEY
  ? new StackServerApp({
      tokenStore: 'nextjs-cookie',
      urls: {
        signIn: '/login',
        signUp: '/register',
        afterSignIn: '/',
        afterSignUp: '/',
      },
    })
  : (createMockStackApp() as unknown as typeof StackServerApp);
