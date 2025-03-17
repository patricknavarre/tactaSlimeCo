import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Admin authentication handler
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Check credentials against admin values in .env
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
          };
        }

        // Return null if credentials are invalid
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to client-side session
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 