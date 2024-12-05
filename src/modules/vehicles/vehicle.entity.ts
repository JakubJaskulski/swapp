import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Vehicle {
  @PrimaryColumn()
  url: string;

  @Column()
  name: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column()
  cost_in_credits: string;

  @Column()
  length: string;

  @Column()
  max_atmosphering_speed: string;

  @Column()
  crew: string;

  @Column()
  passengers: string;

  @Column()
  cargo_capacity: string;

  @Column()
  consumables: string;

  @Column()
  vehicle_class: string;

  @Column("text", { array: true })
  films: string[];

  @Column("text", { array: true })
  pilots: string[];

  @Column()
  created: string;

  @Column()
  edited: string;
}
