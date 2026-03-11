import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from '../../application/customer.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdResponse } from 'src/common/dto/id.response.dto';
import { CreateCustomerCommand } from 'src/customers/application/commands/create-customer.command';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerReadModel } from 'src/customers/domain/read-models/customer.read-model';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { UpdateCustomerCommand } from 'src/customers/application/commands/update-customer.command';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um cliente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const id = await this.customerService.create(
      new CreateCustomerCommand(
        createCustomerDto.name,
        createCustomerDto.email,
        createCustomerDto.cpf
      ),
    );

    return new IdResponse(id);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Listar um cliente pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna um cliente pelo ID',
    type: CustomerReadModel,
  })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna todos os clientes',
    type: [CustomerReadModel],
  })
  findAll() {
    return this.customerService.findAll();
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Listar um cliente pelo CPF' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna um cliente pelo CPF',
    type: CustomerReadModel,
  })
  findByCpf(@Param('cpf') cpf: string) {
    return this.customerService.findByCpf(cpf);
  }

  @ApiOperation({ summary: 'Atualizar um cliente pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Atualiza um cliente pelo ID',
    type: CustomerReadModel,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.customerService.update(
      new UpdateCustomerCommand(id, updateCustomerDto),
    );

    return new IdResponse(id);
  }

  @ApiOperation({ summary: 'Deletar um cliente pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleta um cliente pelo ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removedId = await this.customerService.remove(id);
    return new IdResponse(removedId);
  }
}
