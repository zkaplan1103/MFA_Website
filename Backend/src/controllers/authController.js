import bcrypt from "bcryptjs";
import { User, AuthUser } from "../models/user.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Helper function to generate a 6-character code
const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

// Helper function to send an email
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

// User and AuthUser Registration
export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            isMfaActive: false,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user", message: error.message });
    }
};

export const authregister = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAuthUser = new AuthUser({
            username,
            password: hashedPassword,
            email,
            isMfaActive: false,
        });
        await newAuthUser.save();
        res.status(201).json({ message: "AuthUser registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering AuthUser", message: error.message });
    }
};

// Login Handling for Both User and AuthUser
export const login = async (req, res) => {
    try {
        console.log("Authenticated user:", req.user);
        const { user, userType } = req.user;
        
        res.status(200).json({
            message: "User logged in successfully",
            username: user.username,
            email: user.email,
            isMfaActive: user.isMfaActive,
            userType,
        });
    } catch (error) {
        res.status(500).json({ error: "Error during login", message: error.message });
    }
};

// Auth Status Handling
export const authStatus = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
    }

    const { user, userType } = req.user;
    res.status(200).json({
        message: "User logged in successfully",
        username: user.username,
        email: user.email,
        isMfaActive: user.isMfaActive,
        userType,
    });
};

// Logout Handling
export const logout = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
    }

    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
};

// Setup 2FA for User and AuthUser
export const setup2FA = async (req, res) => {
    try {
        const { user, userType } = req.user;
        const code = generateCode();

        user.twoFactorSecret = code;
        user.isMfaActive = true;
        await user.save();

        await sendEmail(user.email, "Your 2FA Code", `Your 2FA code is: ${code}`);

        res.status(200).json({ 
            message: "2FA setup successfully. Check your email for the code.", 
            userType 
        });
    } catch (error) {
        res.status(500).json({ message: "Error setting up 2FA", error: error.message });
    }
};

// Verify 2FA Code for Login
export const verify2FA = async (req, res) => {
    try {
        const { user, userType } = req.user;
        const { token } = req.body;

        if (!user.twoFactorSecret || user.twoFactorSecret !== token) {
            return res.status(400).json({ message: "Invalid 2FA token" });
        }

        const jwtToken = jwt.sign(
            { username: user.username, email: user.email, userType },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );

        res.status(200).json({ message: "2FA successful", token: jwtToken, userType });
    } catch (error) {
        res.status(500).json({ message: "Error verifying 2FA", error: error.message });
    }
};

// Reset 2FA for User and AuthUser
export const reset2FA = async (req, res) => {
    try {
        const { user, userType } = req.user;

        user.twoFactorSecret = "";
        user.isMfaActive = false;
        await user.save();

        res.status(200).json({ message: "2FA reset successful", userType });
    } catch (error) {
        res.status(500).json({ error: "Error resetting 2FA", message: error.message });
    }
};
