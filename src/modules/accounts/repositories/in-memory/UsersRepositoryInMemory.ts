import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create(data: ICreateUserDTO): Promise<void> {
    const { name, password, email, driver_license } = data;
    const user = new User();

    Object.assign(user, {
      name,
      password,
      email,
      driver_license,
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find(user => user.email === email);

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);

    return user;
  }
}

export { UsersRepositoryInMemory };
