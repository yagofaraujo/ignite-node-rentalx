import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('Should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'ABC-4321',
      fine_amount: 40,
      brand: 'Car_brand_test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_test',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'CarTest',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'CBA-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'CarTest',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car4',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'CBA-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id: 'category_id_teste',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id_teste',
    });

    expect(cars).toEqual([car]);
  });
});
