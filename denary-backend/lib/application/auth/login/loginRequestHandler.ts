import login from "./loginHandler";
import requestValidator from "./validators/loginRequestValidation";

export default {
    handle: login,
    validate: requestValidator,
};
