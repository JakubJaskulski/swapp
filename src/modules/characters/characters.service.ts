import { Injectable } from "@nestjs/common";
import { SwapiCharacter, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw } from "typeorm";
import { Character } from "./character.entity";
import { BaseRepository } from "../../repositories/swapp-repository";

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: BaseRepository<Character>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<Character[]> {
    const cachedFilms = await this.charactersRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiCharacters = await this.swapiService.getSwapiCharacters(
      search,
      page,
    );

    swapiCharacters.forEach((swapiCharacter) => {
      this.charactersRepository.upsertWithArrayMerge(swapiCharacter, "url", [
        "search",
      ]);
    });

    return swapiCharacters.map((swapiCharacter) => {
      delete swapiCharacter["search"];
      delete swapiCharacter["page"];
      return swapiCharacter;
    });
  }

  async findOne(id): Promise<Character> {
    return await this.swapiService.getSwapiCharacter(id);
  }
}
