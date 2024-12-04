import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Character {
  @PrimaryColumn()
  url: string;

  @Column()
  name: string;

  @Column()
  height: string;

  @Column()
  mass: string;

  @Column()
  hair_color: string;

  @Column()
  skin_color: string;

  @Column()
  eye_color: string;

  @Column()
  birth_year: string;

  @Column()
  gender: string;

  @Column()
  homeworld: string;

  @Column("text", { array: true })
  films: string[];

  @Column("text", { array: true })
  starships: string[];

  @Column("text", { array: true })
  vehicles: string[];

  @Column("text", { array: true })
  species: string[];

  @Column()
  created: string;

  @Column()
  edited: string;
}
