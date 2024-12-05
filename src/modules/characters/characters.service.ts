import { Injectable } from "@nestjs/common";
import { SwapiCharacter, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Character } from "./character.entity";

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<Character[]> {
    const dbCharacters = await this.charactersRepository.find();

    if (dbCharacters && dbCharacters.length > 0) {
      return dbCharacters;
    }

    const swapiCharacters = await this.swapiService.getSwapiCharacters(
      search,
      page,
    );

    await this.charactersRepository.save(swapiCharacters);

    return swapiCharacters;
  }

  async findOne(id): Promise<SwapiCharacter> {
    return await this.swapiService.getSwapiCharacter(id);
  }
}
