import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './database.js';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Cream Dream API (SQLite) is running!');
});

// Initialize DB and Start Server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to initialize database:', err);
});
