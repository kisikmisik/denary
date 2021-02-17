import { ImportanceLevel } from "./applicationError";
import { SystemError } from "./systemError";

export class NotImplementedError extends SystemError {
    constructor() {
        super("This part of application is not implemented yet", ImportanceLevel.HIGH);
    }
}
