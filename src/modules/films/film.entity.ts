import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Film {
  @PrimaryColumn()
  url: string;

  @Column()
  episode_id: number;

  @Column()
  title: string;

  @Column()
  opening_crawl: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column()
  release_date: string;

  @Column("text", { array: true })
  characters: string[];

  @Column("text", { array: true })
  planets: string[];

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

  @Column("text", { array: true, nullable: true, select: false })
  search: string[];

  @Column({ select: false })
  page: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    select: false,
  })
  public createdAt?: Date;
}
