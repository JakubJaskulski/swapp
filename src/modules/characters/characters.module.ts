import { Module } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./character.entity";
import { CharactersController } from "./characters.controller";
import { BaseRepository } from "../../repositories/swapp-repository";
import { DataSource } from "typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Character])],
  controllers: [CharactersController],
  providers: [
    CharactersService,
    {
      provide: "CharacterRepository",
      useFactory: (dataSource) =>
        new BaseRepository<Character>(Character, dataSource),
      inject: [DataSource],
    },
  ],
  exports: [CharactersService],
})
export class CharactersModule {}
