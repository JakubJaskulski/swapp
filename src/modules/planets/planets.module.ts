import { Module } from "@nestjs/common";
import { PlanetsController } from "./planets.controller";
import { PlanetsService } from "./planets.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Planet } from "./planet.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { DataSource } from "typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetsController],
  providers: [
    PlanetsService,
    {
      provide: "PlanetRepository",
      useFactory: (dataSource) =>
        new BaseRepository<Planet>(Planet, dataSource),
      inject: [DataSource],
    },
  ],
})
export class PlanetsModule {}
