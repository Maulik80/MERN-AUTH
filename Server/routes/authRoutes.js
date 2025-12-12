import express from "express";
import { login, logout, register, sendVerifyOtp,verifiEmail,isAuthenticated, sentResetOtp, resetPassword } from '../controllers/authcontrollers.js';
import UserAuth from "../Middleware/UserAuth.js";

const authRoutes = express.Router();

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',logout);
authRoutes.post('/sent-verify-otp',UserAuth,sendVerifyOtp);
authRoutes.post('/verify-account',UserAuth,verifiEmail);
authRoutes.get('/is-auth',UserAuth,isAuthenticated);
authRoutes.post('/sent-reset-otp',sentResetOtp);
authRoutes.post('/reset-password',resetPassword);

export default authRoutes;
