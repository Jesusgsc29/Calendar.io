import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../index.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.upsert({
      where: { googleId: profile.id },
      update: {
        accessToken,
        refreshToken: refreshToken || undefined,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value,
      },
      create: {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value,
        accessToken,
        refreshToken,
      },
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});