import { Logger } from '@nestjs/common';
import { SmtpTransport } from '@upyo/smtp';
import { createMessage } from '@upyo/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@/config/config.service';

import { MailService } from './mail.service';

jest.mock('@upyo/smtp');
jest.mock('@upyo/core');

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let mockSmtpTransport: jest.Mocked<SmtpTransport>;

  const mailConfig = {
    sender: 'test@example.com',
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'testuser',
      pass: 'testpass',
    },
  };

  beforeEach(async () => {
    mockSmtpTransport = {
      send: jest.fn(),
    } as any;

    (SmtpTransport as jest.Mock).mockImplementation(() => mockSmtpTransport);
    (createMessage as jest.Mock).mockImplementation((params) => params);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(mailConfig),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);

    // Spy on logger methods
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with the correct configuration', () => {
    expect(configService.getOrThrow).toHaveBeenCalledWith('mail');
    expect(SmtpTransport).toHaveBeenCalledWith(mailConfig);
  });

  describe('send', () => {
    const recipient = 'recipient@example.com';
    const body = 'Test email body';
    const subject = 'Test Subject';

    it('should successfully send an email', async () => {
      const messageId = 'test-message-id';
      mockSmtpTransport.send.mockResolvedValue({
        successful: true,
        messageId,
      });

      await service.send(recipient, body, subject);

      // Verify createMessage was called with the correct parameters
      expect(createMessage).toHaveBeenCalledWith({
        from: mailConfig.sender,
        to: recipient,
        subject,
        content: { text: body, html: body },
      });

      // Verify transport.send was called with the message
      expect(mockSmtpTransport.send).toHaveBeenCalled();

      // Verify successful log message
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Message sent with ID:',
        messageId,
      );
    });

    it('should log an error when sending fails', async () => {
      const errorMessages = ['SMTP error', 'Connection timeout'];
      mockSmtpTransport.send.mockResolvedValue({
        successful: false,
        errorMessages,
      });

      await service.send(recipient, body, subject);

      // Verify error was logged
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        'Send failed:',
        errorMessages.join(', '),
      );
    });
  });
});
