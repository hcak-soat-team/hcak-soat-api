import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../../application/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { IdResponse } from 'src/common/dto/id.response.dto';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { UpdateCustomerCommand } from 'src/customers/application/commands/update-customer.command';

describe('CustomerController', () => {
    let controller: CustomerController;
    let service: CustomerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CustomerController],
            providers: [
                {
                    provide: CustomerService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        findByCpf: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CustomerController>(CustomerController);
        service = module.get<CustomerService>(CustomerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a customer and return an IdResponse', async () => {
            const createCustomerDto: CreateCustomerDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                cpf: '12345678900',
            };
            const id = '1';
            jest.spyOn(service, 'create').mockResolvedValue(id);

            const result = await controller.create(createCustomerDto);

            expect(service.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: createCustomerDto.name,
                    email: createCustomerDto.email,
                    cpf: createCustomerDto.cpf,
                }),
            );
            expect(result).toEqual(new IdResponse(id));
        });
    });

    describe('findOne', () => {
        it('should return a customer by ID', async () => {
            const id = '1';
            const customer: CustomerReadModel = {
                id,
                name: 'John Doe',
                email: 'john.doe@example.com',
                cpf: '12345678900',
            };
            jest.spyOn(service, 'findOne').mockResolvedValue(customer);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(customer);
        });
    });

    describe('findByCpf', () => {
        it('should return a customer by CPF', async () => {
            const cpf = '12345678900';
            const customer: CustomerReadModel = {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                cpf,
            };
            jest.spyOn(service, 'findByCpf').mockResolvedValue(customer);

            const result = await controller.findByCpf(cpf);

            expect(service.findByCpf).toHaveBeenCalledWith(cpf);
            expect(result).toEqual(customer);
        });
    });
    
    describe('update', () => {
        it('should update a customer and return an IdResponse', async () => {
            const id = '1';
            const updateCustomerDto: UpdateCustomerDto = {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                cpf: '09876543210',
            };
            jest.spyOn(service, 'update').mockResolvedValue(undefined);

            const result = await controller.update(id, updateCustomerDto);

            expect(service.update).toHaveBeenCalledWith(
                new UpdateCustomerCommand(id, updateCustomerDto),
            );
            expect(result).toEqual(new IdResponse(id));
        });
    });

    describe('remove', () => {
        it('should remove a customer and return an IdResponse', async () => {
            const id = '1';
            jest.spyOn(service, 'remove').mockResolvedValue(id);

            const result = await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
            expect(result).toEqual(new IdResponse(id));
        });

    });
});