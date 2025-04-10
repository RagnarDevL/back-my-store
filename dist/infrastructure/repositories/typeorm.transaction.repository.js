"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const nestTypeorm = require('@nestjs/typeorm');
const typeorm = require('typeorm');
const transaction_entity_1 = require("../../core/domain/transaction.entity");
let TypeOrmTransactionRepository = class TypeOrmTransactionRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(transaction) {
        const entity = this.repository.create(transaction);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async update(id, updates) {
        await this.repository.update(id, updates);
        return this.findByReference(id);
    }
    async findByReference(reference) {
        const entity = await this.repository.findOne({ where: { reference } });
        return entity ? this.toDomain(entity) : null;
    }
    toDomain(entity) {
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
};
exports.TypeOrmTransactionRepository = TypeOrmTransactionRepository;
exports.TypeOrmTransactionRepository = TypeOrmTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, nestTypeorm.InjectRepository(transaction_entity_1.TransactionEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm !== "undefined" && typeorm.Repository) === "function" ? _a : Object])
], TypeOrmTransactionRepository);
//# sourceMappingURL=typeorm.transaction.repository.js.map