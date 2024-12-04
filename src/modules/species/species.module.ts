import { Module } from "@nestjs/common";
import { SpeciesController } from "./species.controller";
import { SpeciesService } from "./species.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { Species } from "./species.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Species])],
  controllers: [SpeciesController],
  providers: [SpeciesService],
})
export class SpeciesModule {}