import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategoriesService } from '../../application/categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryReadModel } from '../../domain/read-models/category.read-model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retorna todas as categorias',
    type: [CategoryReadModel],
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}
