import { getRepository, Repository } from 'typeorm';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import {
  ISpecificationsRepository,
  ICreateSpecificationDTO,
} from '@modules/cars/repositories/ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = await this.repository.create({
      description,
      name,
    });

    await this.repository.save(specification);
    return specification;
  }

  async findByName(name: string): Promise<Specification> {
    const findedSpecification = await this.repository.findOne({ name });

    return findedSpecification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.findByIds(ids);

    return specifications;
  }
}

export { SpecificationsRepository };
