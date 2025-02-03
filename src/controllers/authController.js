import bcrypt from "bcryptjs";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

// Helper function to generate a 6-character code
const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

// Helper function to send an email
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Update this if not using Gmail
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
        console.log("New User:", newUser);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user", message: error });
    }
};
export const login = async (req, res) => {
    console.log("The authenticated user is : ", req.user);
    res.status(200).json({
        message: "User logged in successfully",
        username: req.user.username,
        email: req.user.email,
        isMfaActive: req.user.isMfaActive,
    });
};
export const authStatus = async (req, res) => {
    if(req.user){
        res.status(200).json({
            message: "User logged in successfully",
            username: req.user.username,
            email: req.user.email,
            isMfaActive: req.user.isMfaActive,
        });
    } else {
        res.status(401).json({message: "Unauthorized user"});
    }
};
export const logout = async (req, res) => {
    if(!req.user) res.status(401).json({message: "Unauthorized user"});
    req.logout((err) => {
        if (err) return res.status(400).json({message: "User not logged in"});
                res.status(200).json({message: "Logout successful"});
    });
};
export const setup2FA = async (req, res) => {
    try {
        const user = req.user;
        const code = generateCode();  // Generate a 6-character code
        user.twoFactorSecret = code;
        user.isMfaActive = true;
        await user.save();

        // Send the code to the user's email
        await sendEmail(user.email, "Your 2FA Code", `Your 2FA code is: ${code}`);

        res.status(200).json({ message: "2FA setup successfully. Check your email for the code." });
    } catch (error) {
        res.status(500).json({ message: "Error setting up 2FA", error });
    }
};

export const verify2FA = async (req, res) => {
    const { token } = req.body;
    const user = req.user;

    if (user.twoFactorSecret === token) {
        const jwtToken = jwt.sign(
            { username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );
        res.status(200).json({ message: "2FA successful", token: jwtToken });
    } else {
        res.status(400).json({ message: "Invalid 2FA token" });
    }
};

export const reset2FA = async (req, res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.isMfaActive = false;
        await user.save();
        res.status(200).json({ message: "2FA reset successful" });
    } catch (error) {
        res.status(500).json({ error: "Error resetting 2FA", message: error });
    }
};
