# Tacta Slime Deployment Checklist

This document outlines the steps required to deploy the Tacta Slime website to production.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All features are tested and working locally
- [ ] No console.log statements or debugging code left in
- [ ] Environment variables are properly set up
- [ ] Code is committed to a version control system (Git)

### Environment Variables
- [ ] MongoDB connection string is configured for production
- [ ] NextAuth secret is secure and configured
- [ ] Admin credentials are set for production
- [ ] Proper API URLs are configured
- [ ] Shopify integration keys (if applicable) are set

### Database
- [ ] MongoDB Atlas cluster is set up
- [ ] Network access allows connections from deployment services
- [ ] Initial data is seeded (if required)
- [ ] Indexes are created for performance

## Vercel Deployment (Frontend & API)

### Setup
- [ ] Sign up for Vercel account
- [ ] Connect your Git repository
- [ ] Configure build settings:
  - Framework preset: Next.js
  - Build command: `npm run build`
  - Output directory: `.next`

### Environment Variables
Add the following to Vercel's environment variables:
- [ ] `MONGODB_URI` - Production MongoDB connection string
- [ ] `NEXTAUTH_URL` - Your deployment URL (e.g., https://tacta-slime.vercel.app)
- [ ] `NEXTAUTH_SECRET` - A secure random string
- [ ] `ADMIN_EMAIL` - Admin email address
- [ ] `ADMIN_PASSWORD` - Secure admin password
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL` - Same as admin email
- [ ] `NEXT_PUBLIC_ADMIN_PASSWORD` - Same as admin password
- [ ] `NEXT_PUBLIC_BACKEND_URL` - Use `/api` if deploying API routes to Vercel
- [ ] `NODE_ENV` - Set to `production`

### Deployment
- [ ] Click "Deploy" and wait for build to complete
- [ ] Verify that build succeeds without errors
- [ ] Test deployed site functionality

## Render Deployment (Optional for Separate Backend)

### Setup
- [ ] Sign up for Render account
- [ ] Connect your Git repository
- [ ] Create Web Service with:
  - Name: `tacta-slime-backend`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `npm run start:backend`

### Environment Variables
Add the same environment variables as Vercel, plus:
- [ ] `PORT` - Set to the port Render will use (e.g., 10000)
- [ ] Configure CORS to allow requests from your Vercel frontend

### Deployment
- [ ] Deploy and wait for build to complete
- [ ] Test backend API endpoints
- [ ] Verify frontend can connect to backend

## Post-Deployment Tasks

### Testing
- [ ] Verify all pages load correctly
- [ ] Test product creation, updating, and deletion
- [ ] Test checkout process
- [ ] Test admin login and dashboard
- [ ] Test responsive design on mobile devices

### Domain Configuration
- [ ] Set up custom domain in Vercel (and Render if applicable)
- [ ] Configure DNS records
- [ ] Set up SSL certificates (automatic with Vercel)
- [ ] Update `NEXTAUTH_URL` to use custom domain
- [ ] Test site with custom domain

### Monitoring and Analytics
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Set up analytics (e.g., Google Analytics)
- [ ] Configure performance monitoring

## Troubleshooting Common Issues

### Database Connection Issues
- Check that MongoDB Atlas IP allowlist includes your Vercel deployment
- Verify MongoDB connection string is correct
- Check database user permissions

### Build Failures
- Look at build logs for specific errors
- Make sure all dependencies are properly installed
- Check for environment variables that might be missing

### API Connection Issues
- Verify API URLs are correct in environment variables
- Check CORS configuration
- Test API endpoints directly

## Maintenance

- Schedule regular backups of your MongoDB database
- Implement monitoring for uptime and performance
- Keep dependencies updated with `npm audit` and regular updates 