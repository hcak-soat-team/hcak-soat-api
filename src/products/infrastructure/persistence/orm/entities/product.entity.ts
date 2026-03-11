import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column('decimal', { precision: 10, scale: 2 })
    price: number

    @Column({ name: 'category_id', type: 'uuid' })
    category_id: string

    @Column({ type: 'integer', default: 0 })
    stock: number

    @Column({ type: 'text', nullable: true })
    image: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date
}