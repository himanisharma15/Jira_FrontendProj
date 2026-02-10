# Frontend Deployment Guide

## Environment Variables Configuration

This application uses environment variables to connect to the backend API. The API URL can be configured for different environments (development, production) without changing the code.

### Local Development Setup

1. Create a `.env` file in the frontend root directory (already created for you):
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

2. Start the backend server on port 5000

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Vercel Deployment

#### Backend Deployment (Already Done)
Your backend is deployed at: https://github.com/himanisharma15/Jira_backendProj.git

After deploying to Vercel, you'll get a URL like: `https://your-backend.vercel.app`

#### Frontend Deployment Steps

1. **Push your code to GitHub** (Already done ✅)
   - Repository: https://github.com/himanisharma15/Jira_FrontendProj.git

2. **Deploy to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `himanisharma15/Jira_FrontendProj`
   - Configure Build Settings:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Set Environment Variables in Vercel:**
   - In your Vercel project settings
   - Go to **Settings** → **Environment Variables**
   - Add the following variable:
     ```
     Name: VITE_API_URL
     Value: https://your-backend.vercel.app/api
     ```
     (Replace with your actual backend Vercel URL)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Environment Variable Reference

- **`VITE_API_URL`**: The base URL for your backend API
  - Local Development: `http://localhost:5000/api`
  - Production: `https://your-backend-url.vercel.app/api`

### Updating Environment Variables

After deploying your backend to Vercel:

1. Copy your backend Vercel URL (e.g., `https://jira-backend-xyz.vercel.app`)
2. Go to your frontend Vercel project settings
3. Update the `VITE_API_URL` environment variable to: `https://jira-backend-xyz.vercel.app/api`
4. Redeploy your frontend (Vercel → Deployments → Redeploy)

### Troubleshooting

**CORS Errors:**
- Make sure your backend `server.js` has the correct CORS configuration
- Update the allowed origins in backend to include your Vercel frontend URL

**API Connection Issues:**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check browser console for the actual API URL being used
- Ensure backend is deployed and accessible

**Environment Variables Not Working:**
- Remember: Vite environment variables must be prefixed with `VITE_`
- Rebuild your project after changing environment variables
- In Vercel, redeploy after updating environment variables

### Quick Reference

```bash
# Check current environment variable (in browser console)
console.log(import.meta.env.VITE_API_URL)

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Repository Links

- **Frontend**: https://github.com/himanisharma15/Jira_FrontendProj.git
- **Backend**: https://github.com/himanisharma15/Jira_backendProj.git
