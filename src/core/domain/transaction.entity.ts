// @ts-ignore
const typeorm = require('typeorm');

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  product: string;
  status: 'PENDING'|'COMPLETED'|'FAILED';
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

// @ts-ignore
@typeorm.Entity()
export class TransactionEntity implements Transaction {
  // @ts-ignore
  @typeorm.PrimaryGeneratedColumn('uuid')
  id: string;

  // @ts-ignore
  @typeorm.Column()
  reference: string;

  // @ts-ignore
  @typeorm.Column()
  amount: number;

  // @ts-ignore
  @typeorm.Column()
  product: string;

  // @ts-ignore
  @typeorm.Column()
  status: 'PENDING'|'COMPLETED'|'FAILED';

  // @ts-ignore
  @typeorm.CreateDateColumn()
  createdAt: Date;

  // @ts-ignore
  @typeorm.UpdateDateColumn()
  updatedAt: Date;

  // @ts-ignore
  @typeorm.Column({ type: 'json', nullable: true })
  wompiResponse?: any;

  // @ts-ignore
  @typeorm.Column({ type: 'json', nullable: true })
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
