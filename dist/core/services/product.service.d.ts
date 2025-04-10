import { ProductRepository } from '../ports/product.repository';
import { Product } from '../domain/product.entity';
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    getAllProducts(): Promise<Product[]>;
    getProductById(id: number): Promise<Product | null>;
    createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
    updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null>;
    deleteProduct(id: number): Promise<boolean>;
}
