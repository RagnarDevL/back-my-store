import { TransactionRepository } from './core/ports/transaction.repository';
import { ProductService } from './core/services/product.service';
import { Product } from './core/domain/product.entity';
export declare class AppController {
    private readonly productService;
    private readonly transactionRepository;
    constructor(productService: ProductService, transactionRepository: TransactionRepository);
    getTest(): {
        message: string;
    };
    getProducts(): Promise<Product[]>;
    processSecurePayment(paymentData: any): Promise<{
        success: boolean;
        transactionId: string;
        reference: string;
        wompiResponse: any;
    }>;
    private processWompiPayment;
}
