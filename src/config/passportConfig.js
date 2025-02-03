import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

//to change to email function({usernameField: email}
// Allow login with either username or email
passport.use(new LocalStrategy(
    { usernameField: 'identifier' }, // 'identifier' can be either email or username
    async (identifier, password, done) => {
        try {
            // Search for user by either username or email
            const user = await User.findOne({
                $or: [{ username: identifier }, { email: identifier }]
            });

            if (!user) return done(null, false, { message: "User not found" });

            // Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) return done(null, user);
            else return done(null, false, { message: "Incorrect password" });
        } catch (error) {
            return done(error);
        }
    }
));

  passport.serializeUser((user, done) => {
    console.log("We are inside serializeUser");
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
        console.log("We are inside deserializeUser");
        const user = await User.findById(_id);
        done(null, user);
    } catch (error) {
        done(error);
    }
  });