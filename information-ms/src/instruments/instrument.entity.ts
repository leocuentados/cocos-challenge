
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'instruments' })
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ticker: string;

  @Column()
  type: string;
}
