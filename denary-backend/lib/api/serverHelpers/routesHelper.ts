import { Application } from "express";
import * as express from "express";
import * as path from "path";
import apiRoutes from "./../../application/router";
export class RoutesHelper {

    public application: Application;

    constructor(app: Application) {
        this.application = app;
    }

    public addApiRoutes() {
        this.application.use("/api", apiRoutes);
        this.application.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
    }
}
