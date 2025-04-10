import { Injectable } from '@nestjs/common';
// @ts-ignore
const nestTypeorm = require('@nestjs/typeorm');
// @ts-ignore
const typeorm = require('typeorm');
import { ProductRepository } from '../../core/ports/product.repository';
import { Product, ProductEntity } from '../../core/domain/product.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    // @ts-ignore
    @nestTypeorm.InjectRepository(ProductEntity)
    // @ts-ignore
    private readonly repository: typeorm.Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({ 
        order: { name: 'ASC' } 
    });
    return entities.map(this.toDomain);
  }

  async findById(id: number): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const entity = this.repository.create(product);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
    await this.repository.update(id, product);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  private toDomain(entity: ProductEntity): Product {
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
}
