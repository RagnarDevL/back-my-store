import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryTransactionRepository } from './infrastructure/repositories/in-memory.transaction.repository';
import { TRANSACTION_REPOSITORY, TransactionRepository } from './core/ports/transaction.repository';
import { AppController } from './app.controller';
import { ProductService } from './core/services/product.service';
import { PRODUCT_REPOSITORY, ProductRepository } from './core/ports/product.repository';
import { TypeOrmProductRepository } from './infrastructure/repositories/typeorm.product.repository';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm.transaction.repository';
import { ProductEntity } from './core/domain/product.entity';
import { TransactionEntity } from './core/domain/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'my-store-wompi-1.c5sioqmq2103.us-east-2.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'W1o2m3p4i5*',
      database: 'nest_db',
      entities: [ProductEntity, TransactionEntity],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },    
    }),
    TypeOrmModule.forFeature([ProductEntity, TransactionEntity])
  ],
  controllers: [AppController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TypeOrmTransactionRepository,
    },
  ],
})
export class AppModule {}
