
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as morgan from "morgan";
import * as swaggerUi from "swagger-ui-express";
 import * as swaggerDocument from "./../documentation/swagger.json";
import { catchHttpErrors, catchSystemError } from "./../infrastructure/middleware/errorHandlingMiddleware";
import RouteNotFoundMiddleware from "./../infrastructure/middleware/routeNotFoundMiddleware";
import DatabaseConnectionHelper from "./serverHelpers/databaseConnectionHelper";
import { MiddlewareHelper } from "./serverHelpers/middlewareHelper";
import { RoutesHelper } from "./serverHelpers/routesHelper";


class App {

    public server: express.Application;
    public routesHelper: RoutesHelper;
    public middlewareHelper: MiddlewareHelper;
    public databaseConnectionHelper: DatabaseConnectionHelper;

    constructor() {
        this.server = express();
        this.server.use(cors());
        this.config();
    }

    private config() {
        dotenv.config();
        this.configureHelpers();
        this.configureServerSettings();
        this.configureApplicationPipeline();
    }

    private configureHelpers() {
        this.routesHelper = new RoutesHelper(this.server);
        this.middlewareHelper = new MiddlewareHelper(this.server);
        this.databaseConnectionHelper = new DatabaseConnectionHelper();
    }

    private configureServerSettings(): void {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
        this.server.use(morgan("combined"));
    }

    private configureApplicationPipeline(): void {
        this.configureRoutes();
        this.addNotFoundHandler();
        this.configureErrorHandleMiddleware();
    }

    //#region Application pipeline configuration

    private configureRoutes(): void {
        this.routesHelper.addApiRoutes();
        this.swaggerSetup();
    }

    private configureErrorHandleMiddleware(): void {
        this.middlewareHelper.applyMiddleware(catchHttpErrors);
        this.middlewareHelper.applyMiddleware(catchSystemError);
    }

    private addNotFoundHandler(): void {
        this.middlewareHelper.applyMiddleware(RouteNotFoundMiddleware);
    }

    //#endregion

    private swaggerSetup(): void {
        this.server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
}

export default App;
