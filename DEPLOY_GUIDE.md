# 🚀 Cream Dream: Cloud Deployment Guide

Follow these steps to take your project from GitHub to a live, public website.

## Phase 1: MongoDB Atlas (The Database)
1.  **Register:** Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2.  **Create Cluster:** Choose "Shared" (Free) and your preferred region.
3.  **Security:** 
    - Go to **Network Access** -> **Add IP Address** -> Select "Allow Access from Anywhere" (0.0.0.0/0).
    - Go to **Database Access** -> **Add New Database User** (Write down the username and password).
4.  **Get Connection String:** Click "Connect" -> "Drivers" -> Copy the string. 
    - *Example:* `mongodb+srv://<username>:<password>@cluster.mongodb.net/creamdream`

---

## Phase 2: Render (The Backend Server)
1.  **Login:** Go to [render.com](https://render.com) and login with your GitHub.
2.  **New Web Service:** Select your "ice cream website" repository.
3.  **Settings:**
    - **Root Directory:** `backend`
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`
4.  **Environment Variables:**
    - `MONGODB_URI`: (Paste your Atlas connection string here).
    - `PORT`: 5000
    - `FRONTEND_URL`: (You will add this after Phase 3).
5.  **Copy Server URL:** Render will give you a link like `https://cream-dream-server.onrender.com`.

---

## Phase 3: Vercel (The Frontend)
1.  **Login:** Go to [vercel.com](https://vercel.com) and login with GitHub.
2.  **Import Project:** Select your "ice cream website" repository.
3.  **Settings:**
    - **Framework Preset:** Vite
    - **Environment Variables:**
        - `VITE_API_URL`: (Paste your Render link from Phase 2).
4.  **Deploy:** Click Deploy. You now have a live link! (e.g., `https://cream-dream.vercel.app`).

---

## Final Step: Secure the Connection
1.  Go back to your **Render Dashboard**.
2.  Add a new Environment Variable: `FRONTEND_URL` = (Your Vercel site link).
3.  Restart the Render service.

**Congratulations! Your cinematic ice cream shop is now live for the world!** 🍦✨
