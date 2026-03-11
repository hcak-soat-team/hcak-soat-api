import { UpdateProductDto } from '../../presenters/dto/update-product.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateProductDto
  ) {}
} 