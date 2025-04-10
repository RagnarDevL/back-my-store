import { Injectable } from '@nestjs/common';
// @ts-ignore
const nestTypeorm = require('@nestjs/typeorm');
// @ts-ignore
const typeorm = require('typeorm');
import { TransactionRepository } from '../../core/ports/transaction.repository';
import { Transaction, TransactionEntity } from '../../core/domain/transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    // @ts-ignore
    @nestTypeorm.InjectRepository(TransactionEntity)
    // @ts-ignore
    private readonly repository: typeorm.Repository<TransactionEntity>,
  ) {}

  async create(transaction: Omit<Transaction, 'id'|'createdAt'|'updatedAt'>): Promise<Transaction> {
    const entity = this.repository.create(transaction);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    await this.repository.update(id, updates);
    return this.findByReference(id);
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { reference } });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      reference: entity.reference,
      amount: entity.amount,
      product: entity.product,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      wompiResponse: entity.wompiResponse,
      shippingData: entity.shippingData
    };
  }
}
