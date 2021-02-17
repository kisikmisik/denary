import {NextFunction, Request, Response, Router} from "express";
import * as multer from "multer";
import { authorize } from "../../infrastructure/middleware/authorizationMiddleware";
import loginRequest from "./login/loginRequestHandler";
import passwwordRequest from "./password/requestHandler";
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: {fileSize: 20 * 1000000} });

class UserController {
    public router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });
        this.configureRoutes();
    }

    public configureRoutes() {

        this.router.post("/login", loginRequest.validate, loginRequest.handle);
        this.router.put("/password", passwwordRequest.validate, passwwordRequest.handle);
        // TODO
        this.router.post("/password", authorize, (req, res, next) => {
            return res.json({
                status: 200,
                message: "Link to reset password send sucessfully",
            });
        });
        this.router.get("/authorized", authorize, (req, res, next) => {
            console.log("** userId: %s", req.body.userId);
            console.log("** permissions: %s", req.body.permissions);
            res.json("AUTHORIZED");
        });
    }
}

export default new UserController().router;
