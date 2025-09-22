import { StackServerApp } from '@stackframe/stack';

// Create a fallback for development when StackAuth is not fully configured
const createFallbackStackApp = () => ({
  getUser: async () => null,
  signIn: () => console.log('Sign in clicked (fallback)'),
  signUp: () => console.log('Sign up clicked (fallback)'),
  signOut: () => console.log('Sign out clicked (fallback)'),
  role: 'USER',
});

export const stackServerApp =
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
  process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    ? new StackServerApp({
        tokenStore: 'nextjs-cookie',
        urls: {
          signIn: '/login',
          signUp: '/register',
          afterSignIn: '/',
          afterSignUp: '/',
        },
      })
    : (createFallbackStackApp() as unknown as typeof StackServerApp);
