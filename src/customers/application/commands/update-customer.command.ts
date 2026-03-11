import { UpdateCustomerDto } from '../../presenters/dto/update-customer.dto';

export class UpdateCustomerCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateCustomerDto
  ) {}
} 