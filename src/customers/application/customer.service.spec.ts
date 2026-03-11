import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CustomerService } from './customer.service';
import { CreateCustomerCommand } from './commands/create-customer.command';

describe('CustomerService', () => {
    let service: CustomerService;
    let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerService,
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

        service = module.get<CustomerService>(CustomerService);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    describe('create', () => {
        it('should execute create customer command', async () => {

            const createCustomerCommand = new CreateCustomerCommand(
                'John Doe',
                'john_doe@mail.com',
                '12345678901'
            );
            const expectedResult = { id: '1', ...createCustomerCommand };
            jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

            const result = await service.create(createCustomerCommand);

            expect(commandBus.execute).toHaveBeenCalledWith(createCustomerCommand);
            expect(result).toEqual(expectedResult);
        });
    });
});