import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Species {
  @PrimaryColumn()
  url: string;

  @Column()
  name: string;

  @Column()
  classification: string;

  @Column()
  designation: string;

  @Column()
  average_height: string;

  @Column()
  skin_colors: string;

  @Column()
  hair_colors: string;

  @Column()
  eye_colors: string;

  @Column()
  average_lifespan: string;

  @Column()
  homeworld: string;

  @Column()
  language: string;

  @Column("text", { array: true })
  films: string[];

  @Column("text", { array: true })
  people: string[];

  @Column()
  created: string;

  @Column()
  edited: string;
}
