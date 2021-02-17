import { Application, ErrorRequestHandler, RequestHandler } from "express";

export class MiddlewareHelper {

    public application: Application;

    constructor(app: Application) {
        this.application = app;
    }

    /**
     * @description Add RequestHandler to application
     *
     * @param {(RequestHandler | ErrorRequestHandler)} middleware RequestHandler object to add
     * @memberof MiddlewareHelper
     */
    public applyMiddleware(middleware: RequestHandler | ErrorRequestHandler): void {
        this.application.use(middleware);
    }

    /**
     * @description Implement all array of middleware, order in array will define order of handling by this middle ware
     *
     * @param {(Array<RequestHandler | ErrorRequestHandler>)} middlewareArray middleware array
     * @memberof MiddlewareHelper
     */
    public applyMiddlewareCollection(middlewareArray: Array<RequestHandler | ErrorRequestHandler>): void {
        for (const middleware of middlewareArray) {
            this.applyMiddleware(middleware);
        }
    }
}
