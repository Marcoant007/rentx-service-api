import { AppError } from "../../../../shared/errors/AppError";
import CarsRepository from "../../infra/typeorm/repositories/CarsRepository";
import { SpecificationsRepository } from "../../infra/typeorm/repositories/SpecificationsRepository";
import CarsRepositoryInMemory from "../../testing/in-memory/CarsRepositoryInMemory";
import { SpecificationRepositoryInMemory } from "../../testing/in-memory/SpecificationRepositoryInMemory";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

describe("Create Car Specification", () => {

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationRepositoryInMemory = new SpecificationRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationRepositoryInMemory);

    })

    it("shoulb not be able to add a new specification to a now-existent car", async () => {
        const car_id = "1234";
        const specifications_id = ["456"];

        await expect(
            createCarSpecificationUseCase.execute({ car_id, specifications_id })
        ).rejects.toEqual(new AppError("Car does not exits!"));
    })


    it("shoulb be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-12345",
            fine_amount: 69, brand: "Brand",
            category_id: "Category"
        });

        const specification = await specificationRepositoryInMemory.create({
            description: "teste",
            name: "teste"
        })

        const specifications_id = [specification.id];
        const specificationsCars = await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id });

        expect(specificationsCars).toHaveProperty("specifications");
        expect(specificationsCars.specifications.length).toBe(1);
    });



})