import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import userModel from "../models/userModel.js";
import transporter from "../config/mailer.js";

// Generate JWT Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// ================= USER LOGIN =================
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = createToken(user._id);

        res.json({
            success: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ================= USER REGISTER =================
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({
            success: true,
            token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {

            const token = jwt.sign(
                email + password,
                process.env.JWT_SECRET
            );

            res.json({
                success: true,
                token
            });

        } else {

            res.json({
                success: false,
                message: "Invalid Credentials"
            });

        }

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

// ================= USER PROFILE =================
const getProfile = async (req, res) => {

    try {

        const { userId } = req.body;

        const user = await userModel
            .findById(userId)
            .select("-password");

        if (!user) {

            return res.json({
                success: false,
                message: "User not found"
            });

        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.json({
                success: false,
                message: "User not found"
            });

        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;

        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Reset Password",

            html: `
                <h2>Password Reset</h2>

                <p>Click the link below to reset your password.</p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link expires in 15 minutes.</p>
            `

        });

        res.json({

            success: true,

            message: "Password reset link sent to your email."

        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;

        const { password } = req.body;

        const user = await userModel.findOne({

            resetToken: token,

            resetTokenExpiry: { $gt: Date.now() }

        });

        if (!user) {

            return res.json({

                success: false,

                message: "Invalid or expired token"

            });

        }

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        user.resetToken = undefined;

        user.resetTokenExpiry = undefined;

        await user.save();

        res.json({

            success: true,

            message: "Password reset successful"

        });

    } catch (error) {

        console.log(error);

        res.json({

            success: false,

            message: error.message

        });

    }
};

export {
    loginUser,
    registerUser,
    adminLogin,
    getProfile,
    forgotPassword,
    resetPassword
};