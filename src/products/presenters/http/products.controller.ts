import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../../application/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductCommand } from 'src/products/application/commands/create-product.command';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IdResponse } from 'src/common/dto/id.response.dto';
import { ProductReadModel } from 'src/products/domain/read-models/product.read-model';
import { UpdateProductCommand } from 'src/products/application/commands/update-product.command';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    const id = await this.productsService.create(
      new CreateProductCommand(
        createProductDto.name,
        createProductDto.description,
        createProductDto.price,
        createProductDto.categoryId,
        createProductDto.stock,
        createProductDto.image,
      ),
    );

    return new IdResponse(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna todos os produtos',
    type: [ProductReadModel],
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID da categoria para filtrar produtos',
  })
  findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.productsService.findByCategory(categoryId);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar um produto pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna um produto pelo ID',
    type: ProductReadModel,
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Atualiza um produto pelo ID',
    type: ProductReadModel,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(
      new UpdateProductCommand(id, updateProductDto),
    );

    return new IdResponse(id);
  }

  @ApiOperation({ summary: 'Deletar um produto pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleta um produto pelo ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removedId = await this.productsService.remove(id);
    return new IdResponse(removedId);
  }
}
