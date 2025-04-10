import { Transaction } from '../domain/transaction.entity';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface TransactionRepository {
  create(transaction: Omit<Transaction, 'id'|'createdAt'|'updatedAt'>): Promise<Transaction>;
  update(id: string, updates: Partial<Transaction>): Promise<Transaction | null>;
  findByReference(reference: string): Promise<Transaction | null>;
}
