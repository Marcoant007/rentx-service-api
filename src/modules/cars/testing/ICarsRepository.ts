
import ICreateCarDTO from "../dtos/ICreateCarDTO";
import Car from "../infra/typeorm/entities/Car";

interface ICarsRepository {
    findById(id: string): Promise<Car>;

    create(data: ICreateCarDTO): Promise<Car>;

    findByLicensePlate(license_plate: string): Promise<Car>;

    findAvailable(brand?: string, category_id?: string, name?: string):Promise<Car[]>
    
    updateAvailable(id: string, available: boolean) : void;

}

export default ICarsRepository