"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_repository_1 = require("./core/ports/transaction.repository");
const app_controller_1 = require("./app.controller");
const product_service_1 = require("./core/services/product.service");
const product_repository_1 = require("./core/ports/product.repository");
const typeorm_product_repository_1 = require("./infrastructure/repositories/typeorm.product.repository");
const typeorm_transaction_repository_1 = require("./infrastructure/repositories/typeorm.transaction.repository");
const product_entity_1 = require("./core/domain/product.entity");
const transaction_entity_1 = require("./core/domain/transaction.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'my-store-wompi-1.c5sioqmq2103.us-east-2.rds.amazonaws.com',
                port: 5432,
                username: 'postgres',
                password: 'W1o2m3p4i5*',
                database: 'nest_db',
                entities: [product_entity_1.ProductEntity, transaction_entity_1.TransactionEntity],
                synchronize: true,
                ssl: {
                    rejectUnauthorized: false,
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity, transaction_entity_1.TransactionEntity])
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            product_service_1.ProductService,
            {
                provide: product_repository_1.PRODUCT_REPOSITORY,
                useClass: typeorm_product_repository_1.TypeOrmProductRepository,
            },
            {
                provide: transaction_repository_1.TRANSACTION_REPOSITORY,
                useClass: typeorm_transaction_repository_1.TypeOrmTransactionRepository,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map