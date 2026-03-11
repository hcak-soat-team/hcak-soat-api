import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsModule } from './products/products.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { WebhookModule } from './webhook/webhook.module';
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
    }),
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    HealthModule,
    OrdersModule,
    WebhookModule, 
  ],
  controllers: [AppController],
})
export class AppModule {}
