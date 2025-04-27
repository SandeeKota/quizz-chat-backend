import { Router } from "express";
import UserController from "../controller/user.controller";
import { authenticateJWT } from "../middleweres/authMiddleware";

const routerV1 = Router();

routerV1.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to quizz-chat Version 1"
    })
})

routerV1.post("/auth/signup", UserController.signUp);
routerV1.post("/auth/login", UserController.login);



// ========      PROTECTED--ROUTES        ========

routerV1.use(authenticateJWT);
routerV1.get("/auth/user/:secretCode", UserController.getUserBySecretCode);




export default routerV1;