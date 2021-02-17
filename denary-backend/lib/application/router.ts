import { Router } from "express";

class ApiRoutes {

    public router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });
        this.configureRoutes();
    }

    public configureRoutes() {

        // this.router.use("/auth",  authController);
        // this.router.use("/dictionaries",  dictionariesController);
        // this.router.use("/users",  usersController);
    }
}

export default new ApiRoutes().router;
