import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TRANSACTION_REPOSITORY } from './core/ports/transaction.repository';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm.transaction.repository';
import { ProductService } from './core/services/product.service';
import { Product } from './core/domain/product.entity';

describe('AppController', () => {
  let appController: AppController;
  let transactionRepository: jest.Mocked<TypeOrmTransactionRepository>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    transactionRepository = module.get(TRANSACTION_REPOSITORY);
    productService = module.get(ProductService);
  });

  describe('getTest', () => {
    it('should return test message', () => {
      expect(appController.getTest()).toEqual({ message: 'Backend connection successful!' });
    });
  });

  describe('getProducts', () => {
    it('should return products', async () => {
      const mockProducts: Product[] = [{
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        created_at: new Date(),
        updated_at: new Date()
      }];
      
      productService.getAllProducts.mockResolvedValue(mockProducts);
      const result = await appController.getProducts();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('processSecurePayment', () => {
    it('should process payment successfully', async () => {
      const mockPaymentData = {
        encryptedData: 'encrypted-test-data',
        amount: 100,
        product: { id: 1, name: 'Test Product', price: 100 },
        shippingData: {}
      };

      transactionRepository.create.mockResolvedValue({
        id: '1',
        reference: 'test-ref',
        amount: mockPaymentData.amount,
        product: mockPaymentData.product.id.toString(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        shippingData: {
          fullName: 'Test User',
          documentId: '123456789',
          phone: '1234567890',
          email: 'test@example.com',
          address: '123 Test St',
          city: 'Testville',
          state: 'TS',
          zipCode: '12345'
        }
      });

      const result = await appController.processSecurePayment(mockPaymentData);
      expect(result).toHaveProperty('success', true);
      expect(transactionRepository.create).toHaveBeenCalled();
    });
  });
});
