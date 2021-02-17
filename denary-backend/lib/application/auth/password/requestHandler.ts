import password from "./passwordHandler";
import requestValidator from "./validators/requestValidation";

export default {
    handle: password,
    validate: requestValidator,
};
