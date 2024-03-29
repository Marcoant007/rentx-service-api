import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";
import { Rental } from "../infra/typeorm/entities/Rentals";

interface IRentalsRepository {
    findByUserId(user_id: string): Promise<Rental[]>;
    findOpenRentalByCar(car_id: string):Promise<Rental>;
    findOpenRentalByUser(user_id: string):Promise<Rental>;
    create(date: ICreateRentalDTO):Promise<Rental>;
    findById(id: string):Promise<Rental>;
}

export { IRentalsRepository}