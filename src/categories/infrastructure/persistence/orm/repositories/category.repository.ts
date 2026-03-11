import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryReadModel } from 'src/categories/domain/read-models/category.read-model';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryRepository } from 'src/categories/application/ports/categories.repository';
import { CategoryNotFoundException } from 'src/categories/domain/category.errors';
import { In } from 'typeorm';
import { Category } from 'src/categories/domain/category';

@Injectable()
export class OrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryReadModel[]> {
    const categories = await this.categoryRepository.find();
    return categories.map(CategoryMapper.toDomain);
  }

  async findById(id: string): Promise<CategoryReadModel> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return CategoryMapper.toDomain(category);
  }

  async findManyByIds(ids: string[]): Promise<Category[]> {
    const categories = await this.categoryRepository.find({ where: { id: In(ids) } });
    return categories.map(CategoryMapper.toDomain);
  }
} 