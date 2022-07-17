import { IMailProvider } from '../IMailProvider';

class MailProviderInMemory implements IMailProvider {
  private mails: unknown[] = [];

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string,
  ): Promise<void> {
    this.mails.push({
      to,
      subject,
      variables,
      path,
    });
  }
}

export { MailProviderInMemory };
