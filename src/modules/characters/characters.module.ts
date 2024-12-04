import { Module } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./character.entity";
import { CharactersController } from "./characters.controller";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Character])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
