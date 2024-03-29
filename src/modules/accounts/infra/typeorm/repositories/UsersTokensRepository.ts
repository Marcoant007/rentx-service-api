import { Repository, getRepository } from "typeorm";
import { ICreateUserTokensDTO } from "../../../dtos/ICreateUserTokensDTO";
import { IUsersTokensRepository } from "../../../testing/IUsersTokensRepository";
import { UserTokens } from "../entities/UserToken";

class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserTokens>;

    constructor() {
        this.repository = getRepository(UserTokens);
    }

    async create({ user_id, expires_date, refresh_token }: ICreateUserTokensDTO): Promise<UserTokens> {
        const userToken = this.repository.create({
            expires_date,
            refresh_token,
            user_id
        });

        await this.repository.save(userToken);

        return userToken;
    }
}

export { UsersTokensRepository};
