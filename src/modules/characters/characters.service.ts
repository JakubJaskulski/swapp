import { Injectable } from "@nestjs/common";
import { Character } from "./character.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { GenericEntityService } from "../generic-entity.service";
import { BaseRepository } from "../../repositories/swapp-repository";

@Injectable()
export class CharactersService extends GenericEntityService<Character> {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: BaseRepository<Character>,
    swapiService: SwapiService,
  ) {
    super(characterRepository, swapiService);
  }

  async getCharacters(search?: string, page?: number): Promise<Character[]> {
    return this.findAll(Character.swapiName, search, page);
  }

  async getCharacterById(id: number): Promise<Character> {
    return this.findOne(Character.swapiName, id);
  }
}
