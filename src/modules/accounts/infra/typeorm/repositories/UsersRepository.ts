import { getCustomRepository, getRepository, Repository } from "typeorm";
import ICreateUserDTO from "../../../dtos/ICreateUserDTO";
import IUsersRepository from "../../../testing/IUsersRepository";
import User from "../entities/User";

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>

    constructor() {
        this.repository = getRepository(User)
    }
    async findByEmail(email: string): Promise<User> {
       const user = await this.repository.findOne({email});
       return user
    }

    async create({ name, email, driver_license, password, avatar, id, isAdmin }: ICreateUserDTO): Promise<User> {
        const user = this.repository.create({
            name, email, driver_license, password, avatar, id, isAdmin
        });

        await this.repository.save(user);

        return user;
    }

    async findById(id: string): Promise<User>{
        const user = await this.repository.findOne(id);
        return user
    }

}

export default UsersRepository