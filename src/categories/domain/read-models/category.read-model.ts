import { ApiProperty } from "@nestjs/swagger";

export class CategoryReadModel {
  @ApiProperty({
    description: 'Identificador único da categoria',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Lanche',
  })
  name: string;
}
