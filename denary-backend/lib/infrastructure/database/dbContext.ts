import { DictionaryName } from "./../../domain/entity/dictionary_names";
import { DictionaryWord } from "./../../domain/entity/dictionary_words";
import { LoginEvents } from "./../../domain/entity/loginEvents";
import { Passwords } from "./../../domain/entity/passwords";
import { UserPermissions } from "./../../domain/entity/user_permissions";

import { getConnection } from "typeorm";
import { getManager } from "typeorm";
import { AuthorizationTokens } from "../../domain/entity/authorization_tokens";
import { Users } from "./../../domain/entity/users";

export class DbContext {

    public static get getManager() {
        return getManager();
    }
    public static get uersRepository() { return getManager().getRepository(Users); }
    public static get AuthorizationTokensRepository() { return getManager().getRepository(AuthorizationTokens); }
    public static get dictionaryWordRepository() { return getManager().getRepository(DictionaryWord); }
    public static get dictionaryNamesRepository() { return getManager().getRepository(DictionaryName); }
    public static get loginEventsRepository() { return getManager().getRepository(LoginEvents); }
    public static get userPermissionsRepository() { return getManager().getRepository(UserPermissions); }
    public static get passwordsRepository() { return getManager().getRepository(Passwords); }

    public static get authorizationTokensRepository() { return getManager().getRepository(AuthorizationTokens); }

    public static get getRunner() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        return queryRunner;
    }

}
