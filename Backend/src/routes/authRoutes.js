import { Router } from "express";
import passport from "passport";
import { 
    register,
    login,
    logout,
    authStatus,
    setup2FA,
    verify2FA,
    reset2FA,
    authregister
 } from "../controllers/authController.js";


const router = Router();

//registration route 
router.post("/register", register);

//auth registration route
router.post("/authregister", authregister);

//login route
router.post("/login", passport.authenticate("local"), login);

//auth state route
router.get("/status", authStatus);

//logout route
router.post("/logout", logout);

//2fa setup
router.post("/2fa/setup", setup2FA);

router.post("/2fa/verify", verify2FA);

router.post("/2fa/reset", reset2FA);

export default router;

