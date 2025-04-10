// @ts-ignore
const typeorm = require('typeorm');

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

// @ts-ignore
@typeorm.Entity()
export class ProductEntity implements Product {
  // @ts-ignore
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  // @ts-ignore
  @typeorm.Column({ nullable: true })
  name: string;

  // @ts-ignore
  @typeorm.Column({ nullable: true })
  description: string;

  // @ts-ignore
  @typeorm.Column({ nullable: true })
  price: number;

  // @ts-ignore
  @typeorm.Column({ nullable: true })
  stock: number;

  // @ts-ignore
  @typeorm.CreateDateColumn()
  created_at: Date;

  // @ts-ignore
  @typeorm.UpdateDateColumn()
  updated_at: Date;
}
