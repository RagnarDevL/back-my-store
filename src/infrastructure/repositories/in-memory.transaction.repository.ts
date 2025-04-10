import { Injectable } from '@nestjs/common';
import { Transaction } from '../../core/domain/transaction.entity';
import { TransactionRepository } from '../../core/ports/transaction.repository';

@Injectable()
export class InMemoryTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [];

  async create(transaction: Omit<Transaction, 'id'|'createdAt'|'updatedAt'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction | null> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.transactions[index];
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    return this.transactions.find(t => t.reference === reference) || null;
  }
}
