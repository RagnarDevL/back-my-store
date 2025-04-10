import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, ProductRepository } from '../ports/product.repository';
import { Product } from '../domain/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return this.productRepository.create(product);
  }

  async updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
    return this.productRepository.update(id, product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
