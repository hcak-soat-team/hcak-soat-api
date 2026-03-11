import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [],
  exports: [],
})
export class NotificationsModule {}
