import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Planet {
  static swapiName = "planets";

  @PrimaryColumn()
  url: string;

  @Column()
  name: string;

  @Column()
  rotation_period: string;

  @Column()
  orbital_period: string;

  @Column()
  diameter: string;

  @Column()
  climate: string;

  @Column()
  gravity: string;

  @Column()
  terrain: string;

  @Column()
  surface_water: string;

  @Column()
  population: string;

  @Column("text", { array: true })
  films: string[];

  @Column("text", { array: true })
  residents: string[];

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
