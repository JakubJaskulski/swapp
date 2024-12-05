import { Controller, Get, Param, Query } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { Character } from "./character.entity";

@Controller("characters")
export class CharactersController {
  constructor(private readonly characterService: CharactersService) {}

  @Get()
  async getCharacters(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Character[]> {
    return await this.characterService.findAll(search, page);
  }

  @Get(":id")
  async getCharacter(@Param("id") id: string): Promise<Character> {
    return await this.characterService.findOne(id);
  }
}
