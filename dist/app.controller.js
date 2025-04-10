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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const transaction_repository_1 = require("./core/ports/transaction.repository");
const product_service_1 = require("./core/services/product.service");
const axios_1 = require("axios");
const CryptoJS = require('crypto-js');
const wompi_config_1 = require("./config/wompi.config");
let AppController = class AppController {
    productService;
    transactionRepository;
    constructor(productService, transactionRepository) {
        this.productService = productService;
        this.transactionRepository = transactionRepository;
    }
    getTest() {
        return { message: 'Backend connection successful!' };
    }
    async getProducts() {
        return this.productService.getAllProducts();
    }
    async processSecurePayment(paymentData) {
        function generarReferencia() {
            const prefijo = "my-store-";
            const longitudNumeros = 6;
            const longitudLetras = 6;
            const generarLetras = (longitud) => {
                const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                let resultado = '';
                for (let i = 0; i < longitud; i++) {
                    const indice = Math.floor(Math.random() * caracteres.length);
                    resultado += caracteres[indice];
                }
                return resultado;
            };
            const generarNumeros = (longitud) => {
                const caracteres = '0123456789';
                let resultado = '';
                for (let i = 0; i < longitud; i++) {
                    const indice = Math.floor(Math.random() * caracteres.length);
                    resultado += caracteres[indice];
                }
                return resultado;
            };
            const numeros = generarNumeros(longitudNumeros);
            const letras = generarLetras(longitudLetras);
            return prefijo + numeros + letras;
        }
        const Referencia = generarReferencia();
        const transaction = await this.transactionRepository.create({
            reference: Referencia,
            amount: paymentData.amount,
            product: paymentData.product,
            status: 'PENDING',
            shippingData: paymentData.shippingData
        });
        try {
            const wompiResponse = await this.processWompiPayment(paymentData.encryptedData, paymentData.amount);
            await this.transactionRepository.update(transaction.id, {
                status: wompiResponse.success ? 'COMPLETED' : 'FAILED',
                wompiResponse
            });
            if (wompiResponse.success) {
                const product = await this.productService.getProductById(paymentData.product.id);
                if (product) {
                    await this.productService.updateProduct(product.id, {
                        stock: product.stock - 1
                    });
                }
            }
            return {
                success: true,
                transactionId: transaction.id,
                reference: transaction.reference,
                wompiResponse
            };
        }
        catch (error) {
            await this.transactionRepository.update(transaction.id, {
                status: 'FAILED',
                wompiResponse: { error: error.message }
            });
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async processWompiPayment(encryptedData, amount) {
        try {
            const secretKey = "ClaveSecretaWompi";
            const decryptedStr = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
            const cardData = JSON.parse(decryptedStr);
            if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
                throw new common_1.HttpException('Datos de tarjeta inválidos', common_1.HttpStatus.BAD_REQUEST);
            }
            const TokenCard = await axios_1.default.post(`${wompi_config_1.WompiConfig.SANDBOX_URL}/tokens/cards`, {
                number: cardData.number,
                exp_month: cardData.expiry.substring(0, 2),
                exp_year: cardData.expiry.substring(2, 4),
                cvc: cardData.cvv,
                card_holder: cardData.name
            }, {
                headers: {
                    'Authorization': `Bearer ${wompi_config_1.WompiConfig.PUBLIC_KEY}`
                }
            });
            const ACCEPTANCE_TOKEN = await axios_1.default.get(`${wompi_config_1.WompiConfig.SANDBOX_URL}/merchants/${wompi_config_1.WompiConfig.PUBLIC_KEY}`);
            const PublicKey = ACCEPTANCE_TOKEN.data.data.presigned_acceptance.acceptance_token;
            function generarReferencia() {
                const prefijo = "my-store-";
                const longitudNumeros = 6;
                const longitudLetras = 6;
                const generarLetras = (longitud) => {
                    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    let resultado = '';
                    for (let i = 0; i < longitud; i++) {
                        const indice = Math.floor(Math.random() * caracteres.length);
                        resultado += caracteres[indice];
                    }
                    return resultado;
                };
                const generarNumeros = (longitud) => {
                    const caracteres = '0123456789';
                    let resultado = '';
                    for (let i = 0; i < longitud; i++) {
                        const indice = Math.floor(Math.random() * caracteres.length);
                        resultado += caracteres[indice];
                    }
                    return resultado;
                };
                const numeros = generarNumeros(longitudNumeros);
                const letras = generarLetras(longitudLetras);
                return prefijo + numeros + letras;
            }
            const Referencia = generarReferencia();
            var cadenaConcatenada = Referencia + amount + wompi_config_1.WompiConfig.CURRENCY + wompi_config_1.WompiConfig.INTEGRITY_KEY;
            const encondedText = new TextEncoder().encode(cadenaConcatenada);
            const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
            const wompiResponse = await axios_1.default.post(`${wompi_config_1.WompiConfig.SANDBOX_URL}/transactions`, {
                acceptance_token: PublicKey,
                amount_in_cents: amount,
                signature: signature,
                currency: wompi_config_1.WompiConfig.CURRENCY,
                customer_email: wompi_config_1.WompiConfig.DEFAULT_EMAIL,
                payment_method: {
                    type: 'CARD',
                    token: TokenCard.data.data.id,
                    installments: 1
                },
                reference: Referencia
            }, {
                headers: {
                    'Authorization': `Bearer ${wompi_config_1.WompiConfig.PRIVATE_KEY}`
                }
            });
            if (wompiResponse.data.data.status != 'PENDING') {
                throw new common_1.HttpException('Pago no aprobado', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                success: true,
                data: wompiResponse.data.data,
                message: 'pago valido'
            };
        }
        catch (error) {
            console.log("ERORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", error.response.data);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/api/test'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('/api/products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('/api/payments/secure'),
    (0, common_1.Header)('Access-Control-Allow-Origin', '*'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "processSecurePayment", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, common_1.Inject)(transaction_repository_1.TRANSACTION_REPOSITORY)),
    __metadata("design:paramtypes", [product_service_1.ProductService, Object])
], AppController);
//# sourceMappingURL=app.controller.js.map