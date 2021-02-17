import { coinReader } from "../application/reader/coinReader";
import Application from "./app";


const application = new Application();

// application.databaseConnectionHelper.createConnection()
//     .then(() => {
        // const PORT: number = parseInt(process.env.PORT, null) || ServerConstants.DEFAULT_SERVER_PORT;
        // http.createServer(application.server).listen(PORT, async () => {
        //     console.log("Express server listening on port " + PORT);
        // });
        coinReader();
    // })
    // .catch((error) => {
    //     console.error("TypeORM connection error: ", error);
    //     process.exit(1);
    // });

