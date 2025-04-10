export interface Transaction {
    id: string;
    reference: string;
    amount: number;
    product: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    wompiResponse?: any;
    shippingData?: {
        fullName: string;
        documentId: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
}
export declare class TransactionEntity implements Transaction {
    id: string;
    reference: string;
    amount: number;
    product: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    wompiResponse?: any;
    shippingData?: {
        fullName: string;
        documentId: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
}
