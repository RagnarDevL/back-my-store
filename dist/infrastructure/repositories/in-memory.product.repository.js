"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductRepository = void 0;
const common_1 = require("@nestjs/common");
let InMemoryProductRepository = class InMemoryProductRepository {
    products = [];
    idCounter = 1;
    async findAll() {
        return this.products;
    }
    async findById(id) {
        return this.products.find(p => p.id === id) || null;
    }
    async create(product) {
        const newProduct = {
            ...product,
            id: this.idCounter++,
            created_at: new Date(),
            updated_at: new Date()
        };
        this.products.push(newProduct);
        return newProduct;
    }
    async update(id, product) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1)
            return null;
        this.products[index] = {
            ...this.products[index],
            ...product,
            updated_at: new Date()
        };
        return this.products[index];
    }
    async delete(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        return this.products.length !== initialLength;
    }
};
exports.InMemoryProductRepository = InMemoryProductRepository;
exports.InMemoryProductRepository = InMemoryProductRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryProductRepository);
//# sourceMappingURL=in-memory.product.repository.js.map