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
exports.TypeOrmProductRepository = void 0;
const common_1 = require("@nestjs/common");
const nestTypeorm = require('@nestjs/typeorm');
const typeorm = require('typeorm');
const product_entity_1 = require("../../core/domain/product.entity");
let TypeOrmProductRepository = class TypeOrmProductRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        const entities = await this.repository.find({
            order: { name: 'ASC' }
        });
        return entities.map(this.toDomain);
    }
    async findById(id) {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }
    async create(product) {
        const entity = this.repository.create(product);
        const saved = await this.repository.save(entity);
        return this.toDomain(saved);
    }
    async update(id, product) {
        await this.repository.update(id, product);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return (result.affected || 0) > 0;
    }
    toDomain(entity) {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            stock: entity.stock,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }
};
exports.TypeOrmProductRepository = TypeOrmProductRepository;
exports.TypeOrmProductRepository = TypeOrmProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, nestTypeorm.InjectRepository(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm !== "undefined" && typeorm.Repository) === "function" ? _a : Object])
], TypeOrmProductRepository);
//# sourceMappingURL=typeorm.product.repository.js.map