import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Character } from "../characters/character.entity";
import { Film } from "../films/film.entity";

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