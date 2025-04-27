import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
    user?: any;
}
export type RouterHandler = (req: Request, res: Response, next: NextFunction) => void
export type ProtectedRouterHandler = (req: CustomRequest, res: Response, next: NextFunction) => void