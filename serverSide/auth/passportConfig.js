import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { getUserByEmail } from '../queries/userQueries.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get secret from dotenvfile
const JWT_SECRET = process.env.JWT_SECRET;

// JWT strategy for protecting routes
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await getUserByEmail(payload.email); // Use email from inside jwt 
      if (!user) {
        console.log("User not found with ID:", payload.id);
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error in JWT Strategy:", error);
      return done(error, false);
    }
  }
));

export const generateJwt = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' }); // Contains userId and email
};

export default passport;
