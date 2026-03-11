import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateOrderItemDto {
  @ApiProperty({
    description: 'UUID do produto',
    example: 'd79e7d79-c087-4597-8c02-304bbf83b407'
  })
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    minimum: 1,
    example: 2
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'UUID do cliente (opcional)',
    required: false,
    nullable: true,
    example: '3f69217b-d5a0-4dd3-9005-719277ea325b'
  })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [CreateOrderItemDto],
    example: [
      {
        productId: 'd79e7d79-c087-4597-8c02-304bbf83b407', // X-Burger
        quantity: 2
      },
      {
        productId: '5d93ee56-5cc8-4d86-b779-8eb6f29c186e', // Batata Frita
        quantity: 1
      },
      {
        productId: 'f79f4160-e6f0-4458-a287-bdf48b5b4b73', // Refrigerante Lata
        quantity: 2
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
