import { TransactionRepository } from '../../core/ports/transaction.repository';
import { Transaction, TransactionEntity } from '../../core/domain/transaction.entity';
export declare class TypeOrmTransactionRepository implements TransactionRepository {
    private readonly repository;
    constructor(repository: typeorm.Repository<TransactionEntity>);
    create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>;
    update(id: string, updates: Partial<Transaction>): Promise<Transaction | null>;
    findByReference(reference: string): Promise<Transaction | null>;
    private toDomain;
}
