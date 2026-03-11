import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { VideosModule } from './modules/videos/videos.module';
import { ProcessingJobsModule } from './modules/processing-jobs/processing-jobs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: false,
      entities: ['src/**/*.entity.ts'],
      migrations: ['migrations/*.ts'],
    }),
    HealthModule,
    VideosModule,
    ProcessingJobsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
