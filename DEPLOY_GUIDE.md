# 🚀 Cream Dream: Cloud Deployment Guide (MySQL Edition)

Follow these simple steps to host your MySQL database online, run your real-time backend on Render, and launch your responsive store frontend on Vercel!

---

## 📂 Phase 1: Set Up a Free MySQL Database Online
To let your backend save orders and customer data, you need an online MySQL instance. We recommend **Aiven.io** or **Clever Cloud** because they offer clean free tiers:

### Option A: Aiven (Recommended)
1. Go to [aiven.io](https://aiven.io/) and sign up for a free account.
2. Click **Create Service**.
3. Choose **MySQL** as your service type.
4. Choose the **Free Plan** (available in select AWS cloud regions like Virginia/US or Frankfurt/Europe).
5. Name your service `dream-cream-db` and click **Create Service**.
6. Once active, go to your service dashboard. Copy your **Service URI** or copy these details:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345` or `3306`)
   - **User** (usually `avnadmin`)
   - **Password** (the generated secret password)
   - **Database Name** (e.g., `defaultdb` or `creamdream`)

### Option B: Clever Cloud (Fast setup)
1. Go to [clever-cloud.com](https://www.clever-cloud.com/) and register.
2. Go to your Console, click **Create** -> **Add an Add-on** -> Select **MySQL**.
3. Select the **Shared (Free) plan** (10MB limit, perfect for start-ups).
4. Name it and click Next. Your database credentials (Host, User, Password, Port, Name) will display immediately.

---

## 🖥️ Phase 2: Deploy Backend Server to Render
1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`DREAM-CREAM`).
4. Apply these settings:
   - **Name:** `cream-dream-backend`
   - **Root Directory:** `backend` *(Ensure this is set so Render only builds your backend folder)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Scroll down to **Environment Variables** (or click Advanced) and add these keys:
   - `DB_HOST` = (Your MySQL Host from Phase 1)
   - `DB_PORT` = (Your MySQL Port from Phase 1)
   - `DB_USER` = (Your MySQL Username)
   - `DB_PASSWORD` = (Your MySQL Password)
   - `DB_NAME` = (Your MySQL Database Name)
   - `PORT` = `10000` *(Default Render port)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your live API link at the top (e.g. `https://cream-dream-backend.onrender.com`).

---

## 🎨 Phase 3: Deploy Frontend Store to Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `DREAM-CREAM` repository.
4. Configure these options:
   - **Root Directory:** `frontend` *(Ensure this is set so Vercel only builds the frontend React code)*
   - **Framework Preset:** `Vite`
   - **Environment Variables:**
     - Add `VITE_API_URL` = (Paste your live Render link from Phase 2, e.g., `https://cream-dream-backend.onrender.com`)
5. Click **Deploy**. Vercel will build and launch your store!
6. Copy your live Vercel URL (e.g., `https://dream-cream-website.vercel.app`).

---

## 🔒 Final Symmetrical Bindings (CORS Setup)
To keep your WebSockets and admin request approvals fully secure:
1. Go to your **Render Dashboard** for the backend service.
2. Click on **Environment Variables**.
3. Add a new variable:
   - `FRONTEND_URL` = (Your Vercel URL, e.g., `https://dream-cream-website.vercel.app`)
4. Save changes. Render will automatically redeploy.

**Congratulations! Your premium, real-time MySQL ice cream shop and mobile-responsive admin board are now live for the world!** 🍦🚀
