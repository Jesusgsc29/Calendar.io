import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import './config/passport.js';

export const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));