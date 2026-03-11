import { IsOptional, IsUUID, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
    @IsOptional()
    @IsUUID()
    customerId?: string | null;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDto)
    items?: UpdateOrderItemDto[];
  }
  
  export class UpdateOrderItemDto {
    @IsUUID()
    productId: string;
  
    @IsInt()
    @Min(1)
    quantity: number;
  }
  