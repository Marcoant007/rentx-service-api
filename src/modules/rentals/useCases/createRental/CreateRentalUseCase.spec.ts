import dayjs from 'dayjs';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/Implementations/DayjsDateProvider';
import CarsRepositoryInMemory from '../../../cars/testing/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from "../../testing/RentalsRepositoryInMemory";
import { AppError } from '../../../../shared/errors/AppError';
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory);
    });

    it(" should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Bmw Test",
            description: "Bmw car test",
            daily_rate: 100,
            license_plate: "test",
            fine_amount: 40,
            category_id: "BMW",
            brand: "brand"
        });

        const rental = await createRentalUseCase.execute({
            user_id: "12345",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });
        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it(" should not be able to create a new rental if there another open to the same user", async () => {
        await rentalsRepositoryInMemory.create({
           car_id: "121212",
           expected_return_date: dayAdd24Hours,
           user_id: "12345"
        });

        await expect(
            createRentalUseCase.execute({
                user_id: "12345",
                car_id: "121213",
                expected_return_date: dayAdd24Hours,
            })

        ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
    });

    it(" should not be able to create a new rental if there another open to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "teste",
            expected_return_date: dayAdd24Hours,
            user_id: "123"
         });

        await expect(async () => {
            await createRentalUseCase.execute({
                user_id: "123",
                car_id: "teste",
                expected_return_date: dayAdd24Hours,
            });

            await createRentalUseCase.execute({
                user_id: "321",
                car_id: "teste",
                expected_return_date: dayAdd24Hours,
            });

        }).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it(" should not be able to create a new rental with invalid return time ", async () => {

        await expect(async () => {
            await createRentalUseCase.execute({
                user_id: "123",
                car_id: "teste",
                expected_return_date: dayjs().toDate(),
            });

        }).rejects.toEqual(new AppError("Invalid return time!"));
    });
})