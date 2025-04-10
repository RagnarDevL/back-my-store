import { Transaction } from '../../core/domain/transaction.entity';
import { TransactionRepository } from '../../core/ports/transaction.repository';
export declare class InMemoryTransactionRepository implements TransactionRepository {
    private transactions;
    create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>;
    update(id: string, updates: Partial<Transaction>): Promise<Transaction | null>;
    findByReference(reference: string): Promise<Transaction | null>;
}
