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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = void 0;
const typeorm = require('typeorm');
let ProductEntity = class ProductEntity {
    id;
    name;
    description;
    price;
    stock;
    created_at;
    updated_at;
};
exports.ProductEntity = ProductEntity;
__decorate([
    typeorm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductEntity.prototype, "id", void 0);
__decorate([
    typeorm.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    typeorm.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "description", void 0);
__decorate([
    typeorm.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "price", void 0);
__decorate([
    typeorm.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "stock", void 0);
__decorate([
    typeorm.CreateDateColumn(),
    __metadata("design:type", Date)
], ProductEntity.prototype, "created_at", void 0);
__decorate([
    typeorm.UpdateDateColumn(),
    __metadata("design:type", Date)
], ProductEntity.prototype, "updated_at", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    typeorm.Entity()
], ProductEntity);
//# sourceMappingURL=product.entity.js.map