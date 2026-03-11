import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { QueryBus } from '@nestjs/cqrs';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
