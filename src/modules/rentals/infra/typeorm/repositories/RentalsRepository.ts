import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
      start_date: new Date(),
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }
  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const findedRentalByCarId = await this.repository.findOne({
      where: { car_id, end_date: null },
    });

    return findedRentalByCarId;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const findedRentalByUserId = await this.repository.findOne({
      where: { user_id, end_date: null },
    });

    return findedRentalByUserId;
  }

  async findById(id: string): Promise<Rental> {
    const findedRental = await this.repository.findOne({ id });

    return findedRental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const findedRentals = await this.repository.find({
      where: { user_id },
      relations: ['car'],
    });

    return findedRentals;
  }
}

export { RentalsRepository };
