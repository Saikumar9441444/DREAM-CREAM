# Cream Dream Full-Stack eCommerce

A premium ice cream eCommerce platform with MongoDB backend and WhatsApp ordering integration.

## Project Structure
- `/frontend`: React + Vite (UI, Cart, Checkout, WhatsApp logic)
- `/backend`: Node.js + Express + MongoDB (Products, Orders, Admin API)

## Local Setup

### 1. Backend
```bash
cd backend
npm install
# Make sure MongoDB is running locally
npm run dev # or node server.js
```
*Note: Use `node seed.js` to populate the database with initial flavors.*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## WhatsApp Order System
The checkout process automatically formats order details and redirects the customer to send them to the business WhatsApp number. This ensures a seamless "human-in-the-loop" ordering experience without complex payment gateways.

## Deployment Checklist

### Step 1: Connect Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Add it to your backend `.env` file or environment variables as `MONGODB_URI`.

### Step 2: Backend Deployment (Render)
1. Push the `/backend` folder to a new GitHub repo or use a monorepo setup.
2. Deploy to [Render.com](https://render.com) as a "Web Service".
3. Set environment variables: `PORT=10000`, `MONGODB_URI=your_atlas_url`.

### Step 3: Frontend Deployment (Vercel)
1. Deploy the `/frontend` folder to [Vercel](https://vercel.com).
2. Set environment variable: `VITE_API_URL=your_render_backend_url`.

### Step 4: Domain
Connect your custom domain (Namecheap/GoDaddy) via Vercel settings.
