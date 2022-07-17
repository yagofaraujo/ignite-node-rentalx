import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');
    const generateTokenEmail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create',
    );

    await usersRepositoryInMemory.create({
      driver_license: '123456',
      email: 'test@test.com',
      name: 'User Test',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('test@test.com');

    expect(sendMail).toHaveBeenCalled();
    expect(generateTokenEmail).toHaveBeenCalled();
  });

  it('Should not be able to send an email if users does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('invalidemail@test.com'),
    ).rejects.toEqual(new AppError('User does not found!'));
  });
});
