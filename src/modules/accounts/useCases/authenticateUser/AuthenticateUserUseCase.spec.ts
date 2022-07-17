import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { AuthenticateUserUseCase } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authentication an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@test.com',
      name: 'User Test',
      password: '12345',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user).toHaveProperty('name');
    expect(result.user).toHaveProperty('email');
  });

  it('Should not be able to authentication an nonexistent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'fakeuser@test.com',
        password: '123456',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });

  it('Should not be able to authenticate an user with incorrect password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000321',
      email: 'user@test.com',
      name: 'User Test',
      password: '12345',
    };

    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });
});
