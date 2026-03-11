import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from 'src/products/application/products.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductReadModel } from 'src/products/domain/read-models/product.read-model';
import { IdResponse } from 'src/common/dto/id.response.dto';
import { ProductStock } from 'src/products/domain/value-objects/product-stock';
import { CreateProductCommand } from 'src/products/application/commands/create-product.command';
import { UpdateProductCommand } from 'src/products/application/commands/update-product.command';
import { GetProductsQuery } from 'src/products/application/queries/get-products.query';
import { GetProductQuery } from 'src/products/application/queries/get-product.query';
import { GetProductsByCategoryQuery } from 'src/products/application/queries/get-products-by-category.query';
import { DeleteProductCommand } from 'src/products/application/commands/delete-product.command';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockProduct: ProductReadModel = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    categoryId: 'category-123',
    stock: new ProductStock(10),
    image: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
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

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and return its id', async () => {
      // Arrange
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        categoryId: 'category-123',
        stock: 10,
        image: 'https://example.com/image.jpg',
      };
      const expectedId = '1';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedId);

      // Act
      const result = await controller.create(createProductDto);

      // Assert
      expect(result).toBeInstanceOf(IdResponse);
      expect(result.id).toBe(expectedId);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateProductCommand)
      );
      const command = (commandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.name).toBe(createProductDto.name);
      expect(command.description).toBe(createProductDto.description);
      expect(command.price).toBe(createProductDto.price);
      expect(command.categoryId).toBe(createProductDto.categoryId);
      expect(command.stock).toBe(createProductDto.stock);
    });
  });

  describe('findAll', () => {
    it('should return an array of products when no category is provided', async () => {
      // Arrange
      const mockProducts = [mockProduct];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockProducts);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetProductsQuery)
      );
    });

    it('should return filtered products when category is provided', async () => {
      // Arrange
      const categoryId = 'category-123';
      const mockProducts = [mockProduct];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockProducts);

      // Act
      const result = await controller.findAll(categoryId);

      // Assert
      expect(result).toEqual(mockProducts);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetProductsByCategoryQuery)
      );
      const query = (queryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.categoryId).toBe(categoryId);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      // Arrange
      const productId = '1';
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockProduct);

      // Act
      const result = await controller.findOne(productId);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetProductQuery)
      );
      const query = (queryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.id).toBe(productId);
    });
  });

  describe('update', () => {
    it('should update a product and return its id', async () => {
      // Arrange
      const productId = '1';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 149.99,
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(productId);

      // Act
      const result = await controller.update(productId, updateProductDto);

      // Assert
      expect(result).toBeInstanceOf(IdResponse);
      expect(result.id).toBe(productId);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateProductCommand)
      );
      const command = (commandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.id).toBe(productId);
      expect(command.data).toEqual(updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product and return its id', async () => {
      // Arrange
      const productId = '1';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(productId);

      // Act
      const result = await controller.remove(productId);

      // Assert
      expect(result).toBeInstanceOf(IdResponse);
      expect(result.id).toBe(productId);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteProductCommand)
      );
      const command = (commandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.id).toBe(productId);
    });
  });
});
