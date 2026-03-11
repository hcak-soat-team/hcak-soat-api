import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class WebhookNotificationQueryDto {
  @Transform(({ value }) => ({ id: value }))
  data: { id: string };

  @IsString()
  @IsNotEmpty()
  type: string;
}
