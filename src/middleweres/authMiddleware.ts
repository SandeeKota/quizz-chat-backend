import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { ProtectedRouterHandler, RouterHandler } from '../_types/router.interface';



export const authenticateJWT: ProtectedRouterHandler = (req, res, next): void | Response<any, Record<string, any>> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const user = jwt.verify(token, config.JWT_SECRET!);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}