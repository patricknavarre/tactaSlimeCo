# Tacta Slime Company E-commerce Website

A full-stack e-commerce website for Tacta Slime Company, built with Next.js, React, and Shopify integration.

## Features

- **Modern Design**: Clean, responsive UI with pastel color scheme
- **Product Catalog**: Browse and purchase slime products
- **Shopping Cart**: Add products to cart and checkout
- **Admin CMS**: Password-protected admin area for managing products, content, and site appearance
- **Shopify Integration**: Connect with Shopify for enhanced e-commerce features
- **Responsive Layout**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **E-commerce Features**: Shopify API integration
- **Image Processing**: Sharp
- **Form Handling**: React Hook Form, Zod for validation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Shopify Partner account (for Shopify integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tacta-slime.git
   cd tacta-slime
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:5050
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Admin credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   
   # Shopify
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_API_KEY=your_shopify_api_key
   SHOPIFY_API_SECRET=your_shopify_api_secret
   
   # Backend API URL
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5051
   ```

4. Run the development server:
   ```bash
   # To run frontend (port 5050)
   npm run dev -- -p 5050
   
   # To run backend (port 5051) in a separate terminal
   npm run dev:backend
   ```

5. Open [http://localhost:5050](http://localhost:5050) in your browser to see the website.

## Admin CMS

The admin CMS is accessible at `/admin`. Use the credentials specified in your `.env.local` file to log in.

The CMS allows you to:
- Manage products (add, edit, delete)
- Update inventory and pricing
- Edit website content
- Customize the site appearance (colors, fonts, etc.)
- View orders and customer information

## Customization

### Colors

You can customize the color scheme by modifying the `tailwind.config.js` file:

```js
// ...
theme: {
  extend: {
    colors: {
      'tacta-pink': '#FFD1DC',
      'tacta-pink-light': '#FFECF1',
      'tacta-peach': '#FFDAB9',
      'tacta-peach-light': '#FFF0E0',
      'tacta-white': '#FFFFFF',
      'tacta-cream': '#FFFAF0',
    },
  },
},
// ...
```

### Website Content

Most of the website content can be edited through the admin CMS. For structural changes, modify the React components in the `src/components` directory.

## Deployment

### Deploying to Vercel (Frontend)

This application is optimized for deployment on Vercel:

1. **Prepare for deployment**:
   - Ensure your code is in a GitHub, GitLab, or Bitbucket repository
   - Make sure the `.gitignore` file excludes the `.env.local` file and other sensitive information

2. **Deploy to Vercel**:
   - Create an account on [Vercel](https://vercel.com/)
   - Click "Import Project" and select your repository
   - Configure the following settings:
     - Framework Preset: Next.js
     - Root Directory: `./` (or your project directory)
     - Build Command: `npm run build`
     - Output Directory: `.next`
   
3. **Set environment variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to the "Environment Variables" section
   - Add all variables from your `.env.production` file, including:
     - `MONGODB_URI`
     - `NEXTAUTH_URL` (set to your Vercel deployment URL)
     - `NEXTAUTH_SECRET`
     - `ADMIN_EMAIL` and `ADMIN_PASSWORD`
     - Other required variables

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Your app will be available at the provided Vercel URL

### Deploying Backend to Render (Optional)

If you're using a separate backend service:

1. **Create a Web Service on Render**:
   - Sign up for [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your repository
   - Set the following configuration:
     - Name: `tacta-slime-backend` (or your preferred name)
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `npm run start:backend`
   - Set your environment variables similarly to Vercel
   - Select the appropriate plan
   - Click "Create Web Service"

2. **Connect Frontend to Backend**:
   - Set `NEXT_PUBLIC_BACKEND_URL` in Vercel to your Render service URL
   - Ensure CORS is properly configured in your backend

### Integrated Deployment (Recommended)

The simplest approach is to deploy the entire Next.js application (frontend and API routes) to Vercel:

1. **Use Next.js API Routes**:
   - Make sure all backend functionality is in the `/api` routes
   - Set `NEXT_PUBLIC_BACKEND_URL=/api` in your environment variables

2. **Deploy to Vercel**:
   - Follow the Vercel deployment steps above
   - This will host both your frontend and API routes in one place

3. **MongoDB Atlas**:
   - Ensure your MongoDB Atlas cluster allows connections from your Vercel deployment
   - Use IP allowlisting or network access rules in MongoDB Atlas

## Post-Deployment

After deployment, verify the following:

1. **Test all functionality**:
   - Registration/login flows
   - Product browsing and searching
   - Admin dashboard access
   - Order processing
   
2. **Monitor for errors**:
   - Check Vercel logs for any deployment issues
   - Set up error tracking if needed

3. **Set up custom domain**:
   - Configure custom domains in Vercel and/or Render dashboards
   - Update `NEXTAUTH_URL` after setting up your custom domain

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Shopify](https://www.shopify.com/) 