
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'marketdata' })
export class Marketdata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column()
  high: number;

  @Column()
  low: number;

  @Column()
  close: number;

  @Column({name: 'previousclose'})
  previousClose: number;

  @Column()
  date: Date;
}
