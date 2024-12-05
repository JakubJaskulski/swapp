import { Body, Controller, Get, Param } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { Character } from "./character.entity";

@Controller("characters")
export class CharactersController {
  constructor(private readonly characterService: CharactersService) {}

  @Get()
  async getCharacters(@Body() filter: any): Promise<Character[]> {
    return await this.characterService.findAll(filter);
  }

  @Get(":id")
  async getCharacter(@Param("id") id: string): Promise<Character> {
    return await this.characterService.findOne(id);
  }
}
