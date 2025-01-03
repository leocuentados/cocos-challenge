import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity()
export class Test extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', nullable: true })
    name?: string;
}