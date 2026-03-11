import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/create-product.command';

describe('ProductsService', () => {
  let service: ProductsService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should execute create product command', async () => {
      // Arrange
      const createProductCommand = new CreateProductCommand(
        'Test Product',
        'Test Description',
        99.99,
        'category-123',
        10,
        'https://example.com/image.jpg'
      );
      const expectedResult = { id: '1', ...createProductCommand };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(createProductCommand);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(createProductCommand);
      expect(result).toEqual(expectedResult);
    });
  });
});
