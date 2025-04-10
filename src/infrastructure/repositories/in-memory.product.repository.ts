import { Injectable } from '@nestjs/common';
import { Product } from '../../core/domain/product.entity';
import { PRODUCT_REPOSITORY, ProductRepository } from '../../core/ports/product.repository';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];
  private idCounter = 1;

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.idCounter++,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...product,
      updated_at: new Date()
    };
    return this.products[index];
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length !== initialLength;
  }
}
