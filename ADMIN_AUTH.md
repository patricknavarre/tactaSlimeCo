# TactaSlime Admin Authentication

This document explains how the simple admin authentication system works in the TactaSlime CMS.

## Overview

The admin section of the TactaSlime website uses a simple client-side authentication system that protects admin routes with a password. While this is not as secure as a server-side authentication system, it provides a basic level of protection that keeps the admin area private.

## How It Works

1. **Login Process**:
   - The admin login page (`/admin`) authenticates users by checking their email and password against values stored in environment variables.
   - Upon successful authentication, an `adminAuthenticated` flag is set in localStorage.

2. **Route Protection**:
   - All admin pages are wrapped with an `AdminProtection` component that checks for the authentication flag.
   - If the flag is not set, users are redirected to the login page.

3. **Logout Process**:
   - Clicking the logout button removes the authentication flag from localStorage.
   - Users are redirected to the login page.

## Environment Variables

The admin credentials are stored in environment variables:

```
# Public admin credentials for client-side auth
NEXT_PUBLIC_ADMIN_EMAIL=admin@tactaslime.com
NEXT_PUBLIC_ADMIN_PASSWORD=secure-password-here
```

These are exposed to the client side for the simple authentication system. In a production environment, you should:

1. Use strong, unique passwords
2. Consider implementing a more secure server-side authentication system

## Using the AdminProtection Component

To protect any admin route, wrap the page component with the `AdminProtection` component:

```jsx
import AdminProtection from '@/components/AdminProtection';

export default function AdminPage() {
  return (
    <AdminProtection>
      {/* Your admin page content */}
    </AdminProtection>
  );
}
```

## Security Considerations

This simple authentication system has some limitations:

1. It uses client-side storage (localStorage) which can be manipulated by users with technical knowledge.
2. The credentials are exposed in environment variables accessible to the client.
3. There is no session timeout or advanced security features.

For higher security requirements, consider:

1. Implementing NextAuth.js with server-side session management
2. Using a database to store hashed passwords
3. Adding two-factor authentication

## Changing the Admin Password

To change the admin password:

1. Update the `NEXT_PUBLIC_ADMIN_PASSWORD` in your `.env.local` file
2. Restart the application 