import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
}

const MINIMUM_DAILY = 1;

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id }: IRequest): Promise<Rental> {
    const findedRental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(findedRental.car_id);

    if (!findedRental) {
      throw new AppError('Rental does not exists!');
    }

    const calculatedRental = this.calculateRental(
      findedRental,
      car.fine_amount,
      car.daily_rate,
    );

    await this.rentalsRepository.create(calculatedRental);
    await this.carsRepository.updateAvailable(car.id, true);

    return calculatedRental;
  }

  private calculateRental(
    findedRental: Rental,
    carFineAmount: number,
    carDailyRate: number,
  ): Rental {
    const rental = findedRental;
    const dateNow = this.dateProvider.dateNow();
    let total = 0;

    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow(),
    );

    const delayDays = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date,
    );

    if (daily >= MINIMUM_DAILY && delayDays > 0) {
      const calculate_fine = delayDays * carFineAmount;
      total = calculate_fine;
    }

    if (daily <= 0) {
      daily = MINIMUM_DAILY;
    }

    total += daily * carDailyRate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    return rental;
  }
}

export { DevolutionRentalUseCase };
