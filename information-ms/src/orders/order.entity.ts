import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'orders' })
export class Order {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'instrumentid' })
    instrumentId: number;
    @Column({ name: 'userid' })
    userId: number;
    @Column()
    size: number;
    @Column()
    price: number;
    @Column()
    type: string;
    @Column()
    side: string;
    @Column()
    status: string;
    @Column()
    datetime: Date;
}
