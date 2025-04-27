import { ProtectedRouterHandler, RouterHandler } from "../_types/router.interface";
import config from "../config/config";
import { User } from "../modal/User.modal";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserController = {
    signUp: <RouterHandler>(async (req, res) => {
        try {
            const { name, phone, email, password } = req.body;

            if (!name || !phone || !email || !password) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required"
                });
            }
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    error: true,
                    message: "Email already in use"
                });
            }

            // Generate a unique secretCode string
            const uniqueCode = crypto.randomBytes(16).toString('hex');

            const user = new User({ name, phone, email, password, secretCode: uniqueCode });

            await user.save();

            const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET!, { expiresIn: "15d" });

            res.status(201).json({ message: 'User created', token, secretCode: user.secretCode });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error signing up' });
        }
    }),

    login: <RouterHandler>(async (req, res) => {
        try {

            const { email, password } = req.body; // Destructure email and password

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User  not found' });
            }


            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, email: user.email }, config.JWT_SECRET!, { expiresIn: "15d" });

            res.json({ message: 'Logged in', token, user: { id: user._id, email: user.email } });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error logging in' });
        }
    }),

    // Fetch user by secretCode
    getUserBySecretCode: <ProtectedRouterHandler>(async (req, res) => {
        try {
            const { secretCode } = req.params;
            if (!secretCode) {
                return res.status(400).json({ message: 'Secret code is required' });
            }
            const user = await User.findOne({ secretCode });
            if (!user) {
                return res.status(404).json({ message: 'User not found with that secret code' });
            }
            const { password, ...userData } = user.toObject();
            res.status(200).json({ message: "User found", user: user })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user by secret code' });
        }
    })
}

export default UserController;