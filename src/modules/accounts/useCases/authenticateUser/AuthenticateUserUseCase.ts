import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../erros/AppError";
import IUsersRepository from "../../repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {

    }

    async execute({ email, password }: IRequest):Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Email or password incorrect!", 400);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError("Email or password incorrect!", 400);
        }

        const token = sign({}, "e5b76debbddefa798f689fb61c4fa1f4", {
            subject: user.id,
            expiresIn: "1d"
        });

        const tokenReturn: IResponse = {
            token,
            user :{
                name: user.name,
                email: user.email
            }
        }

        return tokenReturn

    }
}

export { AuthenticateUserUseCase }