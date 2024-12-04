import { Module } from "@nestjs/common";
import { FilmsController } from "./films.controller";
import { FilmsService } from "./films.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { Film } from "./film.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Film])],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
