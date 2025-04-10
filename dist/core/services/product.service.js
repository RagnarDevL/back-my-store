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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../ports/product.repository");
let ProductService = class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getAllProducts() {
        return this.productRepository.findAll();
    }
    async getProductById(id) {
        return this.productRepository.findById(id);
    }
    async createProduct(product) {
        return this.productRepository.create(product);
    }
    async updateProduct(id, product) {
        return this.productRepository.update(id, product);
    }
    async deleteProduct(id) {
        return this.productRepository.delete(id);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(product_repository_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductService);
//# sourceMappingURL=product.service.js.map