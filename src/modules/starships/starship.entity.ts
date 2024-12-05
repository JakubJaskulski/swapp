import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Starship {
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
  hyperdrive_rating: string;

  @Column()
  MGLT: string;

  @Column()
  starship_class: string;

  @Column("text", { array: true })
  films: string[];

  @Column("text", { array: true })
  pilots: string[];

  @Column()
  created: string;

  @Column()
  edited: string;
}
