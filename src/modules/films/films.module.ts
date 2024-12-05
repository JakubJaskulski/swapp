import { Module } from "@nestjs/common";
import { FilmsController } from "./films.controller";
import { FilmsService } from "./films.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { Film } from "./film.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BaseRepository } from "../../repositories/swapp-repository";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Film])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: "FilmRepository",
      useFactory: (dataSource) => new BaseRepository<Film>(Film, dataSource),
      inject: [DataSource],
    },
  ],
  exports: ["FilmRepository"],
})
export class FilmsModule {}
