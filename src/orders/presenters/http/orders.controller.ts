import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../../application/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IdResponse } from 'src/common/dto/id.response.dto';
import { CreateOrderCommand } from 'src/orders/application/commands/create-order.command';
import { OrderReadModel } from 'src/orders/domain/read-models/order.read-model';
import { GetOrdersQueryDto } from '../dto/get-orders-query.dto';
import { GetOrdersQuery } from 'src/orders/application/queries/get-orders.query';
import { UpdateOrderStatusCommand } from 'src/orders/application/commands/update-order-status.command';
import { GetKitchenOrdersQuery } from 'src/orders/application/queries/get-kitchen-orders.query';
import { GetKitchenOrdersResponseDto } from '../dto/get-kitchen-orders.response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('kitchen')
  @ApiOperation({
    summary: 'Lista pedidos para a cozinha',
    description: 'Retorna todos os pedidos em andamento ordenados por prioridade:\n' +
      '1. Pronto > 2. Em Preparação > 3. Recebido\n' +
      'Em cada status, os pedidos são ordenados do mais antigo para o mais novo.\n' +
      'Pedidos com status Finalizado ou Pendente não aparecem nesta lista.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos para a cozinha',
    type: [GetKitchenOrdersResponseDto]
  })
  async getKitchenOrders(): Promise<OrderReadModel[]> {
    return this.ordersService.getKitchenOrders();
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const id = await this.ordersService.create(
      new CreateOrderCommand(createOrderDto.items, createOrderDto.customerId),
    );

    return new IdResponse(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiQuery({
    name: 'paymentStatus',
    enum: ['pending', 'received', 'preparing', 'ready', 'finished'],
    required: false,
    description: 'Filtrar pedidos por status do pagamento',
    example: 'received',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [OrderReadModel],
    description: 'Lista de pedidos retornada com sucesso',
  })
  findAll(@Query() query: GetOrdersQueryDto) {
    return this.ordersService.findAll(new GetOrdersQuery(query.paymentStatus));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderReadModel,
    description: 'Pedido encontrado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/payment-qrcode')
  @ApiOperation({ summary: 'Gerar QR code de pagamento' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do pedido',
    type: 'string',
    example: 'cd8fce34-5045-43f2-96ff-ab36b717bbad',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'QR code gerado com sucesso',
    schema: {
      properties: {
        in_store_order_id: {
          type: 'string',
          example: 'cd8fce34-5045-43f2-96ff-ab36b717bbad',
          description: 'Identificador do pedido na loja',
        },
        qr_data: {
          type: 'string',
          example:
            '00020101021243650016COM.MERCADOLIBRE020130636cd8fce34-5045-43f2-96ff-ab36b717bbad5204000053039865802BR5909Test Test6009SAO PAULO62070503***63045742',
          description: 'Dados do QR code para pagamento',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  async generatePaymentQrcode(@Param('id') id: string) {
    return this.ordersService.generatePaymentQrcode(id);
  }

  @Patch(':id/prepare')
  @ApiOperation({ summary: 'Iniciar preparação do pedido' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido iniciado para preparação com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou pedido não pode ser preparado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
  })
  async prepareOrder(@Param('id') id: string) {
    await this.ordersService.prepareOrder(
      new UpdateOrderStatusCommand(id, 'preparing'),
    );
  }

  @Patch(':id/finalize')
  @ApiOperation({ summary: 'Finalizar preparação do pedido' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido finalizado com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou pedido não pode ser finalizado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
  })
  async finalizeOrder(@Param('id') id: string) {
    await this.ordersService.finalizeOrder(
      new UpdateOrderStatusCommand(id, 'ready'),
    );
  }

  @Patch(':id/deliver')
  @ApiOperation({ summary: 'Marcar pedido como entregue' })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: 'string',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido marcado como entregue com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos ou pedido não pode ser marcado como entregue',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
  })
  async deliverOrder(@Param('id') id: string) {
    await this.ordersService.deliverOrder(
      new UpdateOrderStatusCommand(id, 'finished'),
    );
  }
}
