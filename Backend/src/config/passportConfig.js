import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import {User, AuthUser } from "../models/user.js";

// Allow login with either username or email for both User and AuthUser
passport.use(new LocalStrategy(
    { usernameField: 'identifier' },
    async (identifier, password, done) => {
        try {
            // Search for user in both collections
            let user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
            let userType = "User";
            
            if (!user) {
                user = await AuthUser.findOne({ $or: [{ username: identifier }, { email: identifier }] });
                userType = "AuthUser";
            }
            
            if (!user) return done(null, false, { message: "User not found" });

            // Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) return done(null, { user, userType });
            else return done(null, false, { message: "Incorrect password" });
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((data, done) => {
    console.log("We are inside serializeUser");
    done(null, { id: data.user._id, userType: data.userType });
});

passport.deserializeUser(async (obj, done) => {
    try {
        console.log("We are inside deserializeUser");
        let user;
        let userType = obj.userType;
        
        if (userType === "User") {
            user = await User.findById(obj.id);
        } else {
            user = await AuthUser.findById(obj.id);
        }

        if (!user) return done(null, false);
        done(null, { user, userType }); // Ensure userType persists
    } catch (error) {
        done(error);
    }
});