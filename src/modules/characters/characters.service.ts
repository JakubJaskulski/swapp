import { Injectable } from "@nestjs/common";
import { SwapiCharacter, SwapiService } from "../../shared/swapi/swapi.service";
import { filter } from "lodash";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Character } from "./character.entity";
import { Film } from "../films/film.entity";

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
    private readonly filmRepository: Repository<Film>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(dataFilter: Partial<SwapiCharacter>): Promise<Character[]> {
    const dbCharacters = await this.charactersRepository.find();

    if (dbCharacters && dbCharacters.length > 0) {
      return dbCharacters;
    }

    const swapiCharacters = await this.swapiService.getSwapiCharacters();

    await this.charactersRepository.save(swapiCharacters);

    return filter(swapiCharacters, dataFilter);
  }

  async findOne(id): Promise<SwapiCharacter> {
    return await this.swapiService.getSwapiCharacter(id);
  }
}
