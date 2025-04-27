import mongoose from "mongoose";
import { NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';


interface User {
    name: string;
    phone: string;
    email: string;
    password: string;
    secretCode: string;
}

interface IUser extends mongoose.Document {
    name: string;
    phone: string;
    email: string;
    password: string;
    secretCode: string;
    comparePassword(password: string): Promise<boolean>;
    compareSecretCode(secretCode: string): Promise<boolean>;
}
const userScheam = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    secretCode: { type: String, required: true, unique: true }
}, { timestamps: true });


// Encrypt the password and secretCode before saving
userScheam.pre<IUser>('save', async function (next) {
    // Only hash password when it's modified or when it's a new document
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // If secretCode is not already set (e.g., during initial creation), generate a unique one
    if (!this.secretCode) {
        const uniqueCode = crypto.randomBytes(16).toString('hex');
        this.secretCode = await bcrypt.hash(uniqueCode, 10); // Encrypt the secretCode
    }

    next();
});


// Method to compare password
userScheam.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

// Method to compare secretCode
userScheam.methods.compareSecretCode = async function (secretCode: string) {
    return bcrypt.compare(secretCode, this.secretCode);
};

export const User = mongoose.model<IUser>('User', userScheam);
