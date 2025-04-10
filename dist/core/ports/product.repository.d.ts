import { Product } from '../domain/product.entity';
export declare const PRODUCT_REPOSITORY = "ProductRepository";
export interface ProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    update(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}
