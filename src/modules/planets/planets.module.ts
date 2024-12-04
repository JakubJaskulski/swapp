import { Module } from "@nestjs/common";
import { PlanetsController } from "./planets.controller";
import { PlanetsService } from "./planets.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Planet } from "./planet.entity";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Planet])],
  controllers: [PlanetsController],
  providers: [PlanetsService],
})
export class PlanetsModule {}
