import { Product } from '../../core/domain/product.entity';
import { ProductRepository } from '../../core/ports/product.repository';
export declare class InMemoryProductRepository implements ProductRepository {
    private products;
    private idCounter;
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}
