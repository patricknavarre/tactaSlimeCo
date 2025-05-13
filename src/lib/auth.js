import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// NextAuth configuration options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Auth attempt:', credentials.email);
        
        // First check if admin credentials
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          console.log('Admin login successful');
          return {
            id: 'admin-1',
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
          };
        }
        
        try {
          // If not admin, check regular customer credentials
          const { db } = await connectToDatabase();
          const user = await db.collection('customers').findOne({ email: credentials.email });
          
          if (!user) {
            console.log('User not found');
            return null;
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValid) {
            console.log('Invalid password');
            return null;
          }
          
          console.log('Customer login successful');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.firstName || '',
            role: 'customer'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user properties to JWT token
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user properties to client-side session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login', // Default sign in page
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}; 