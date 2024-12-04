import { Module } from "@nestjs/common";
import { StarshipsController } from "./starships.controller";
import { StarshipsService } from "./starships.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { Starship } from "./starship.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Starship])],
  controllers: [StarshipsController],
  providers: [StarshipsService],
})
export class StarshipsModule {}
