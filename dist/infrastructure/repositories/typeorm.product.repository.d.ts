import { ProductRepository } from '../../core/ports/product.repository';
import { Product, ProductEntity } from '../../core/domain/product.entity';
export declare class TypeOrmProductRepository implements ProductRepository {
    private readonly repository;
    constructor(repository: typeorm.Repository<ProductEntity>);
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
    private toDomain;
}
