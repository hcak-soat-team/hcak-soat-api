import { ApiProperty } from "@nestjs/swagger";
import { ProductStock } from "../value-objects/product-stock";

export class ProductReadModel {
  @ApiProperty({
    description: 'Identificador único do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Lanche',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Lanche de queijo',
  })
  description: string;
  
  @ApiProperty({
    description: 'Preço do produto',
    example: 10.0,
  })
  price: number;

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Estoque do produto',
    example: 10,
  })
  stock: ProductStock;

  @ApiProperty({
    description: 'Imagem do produto',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Data de criação do produto',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do produto',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;
}
