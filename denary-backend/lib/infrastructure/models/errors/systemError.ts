import { ApplicationError, ImportanceLevel } from "./applicationError";

export class SystemError extends ApplicationError {
    constructor(message: string, importanceLevel?: ImportanceLevel) {
        super(message, importanceLevel);
    }
}
