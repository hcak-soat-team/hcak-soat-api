import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
import { CommandBus } from '@nestjs/cqrs';

describe('WebhookService', () => {
  let service: WebhookService;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
