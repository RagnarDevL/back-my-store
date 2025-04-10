export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
}
export declare class ProductEntity implements Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
}
