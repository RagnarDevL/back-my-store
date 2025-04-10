"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
let InMemoryTransactionRepository = class InMemoryTransactionRepository {
    transactions = [];
    async create(transaction) {
        const newTransaction = {
            ...transaction,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.transactions.push(newTransaction);
        return newTransaction;
    }
    async update(id, updates) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index === -1)
            return null;
        this.transactions[index] = {
            ...this.transactions[index],
            ...updates,
            updatedAt: new Date()
        };
        return this.transactions[index];
    }
    async findByReference(reference) {
        return this.transactions.find(t => t.reference === reference) || null;
    }
};
exports.InMemoryTransactionRepository = InMemoryTransactionRepository;
exports.InMemoryTransactionRepository = InMemoryTransactionRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryTransactionRepository);
//# sourceMappingURL=in-memory.transaction.repository.js.map