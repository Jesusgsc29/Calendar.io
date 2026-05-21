import express from 'express';
import passport from 'passport';

const router = express.Router();

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  accessType: 'offline',
  prompt: 'consent', // forces refresh token every time
}));

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => res.json({ success: true }));
});

export default router;