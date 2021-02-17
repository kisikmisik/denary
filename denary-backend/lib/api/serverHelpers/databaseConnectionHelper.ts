import { ConnectionOptions, createConnection, getConnectionOptions } from "typeorm";
import { ImportanceLevel } from "./../../infrastructure/models/errors/applicationError";
import { SystemError } from "./../../infrastructure/models/errors/systemError";

export default class DatabaseConnectionHelper {

    public connectionOptions: ConnectionOptions;

    public async createConnection() {
        try {
            this.connectionOptions = await getConnectionOptions();
            return await createConnection(this.connectionOptions);
        } catch (error) {
            throw new SystemError("Cannot get connection file or connect to server. " + error.message, ImportanceLevel.HIGH);
        }
    }
}
