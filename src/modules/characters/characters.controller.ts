import { Body, Controller, Get, Param } from "@nestjs/common";
import { CharactersService } from "./characters.service";

@Controller("films")
export class CharactersController {
  constructor(private readonly filmService: CharactersService) {}

  @Get()
  async getCharacters(@Body() filter: any): Promise</* TBD */ any[]> {
    return await this.filmService.findAll(filter);
  }

  @Get(":id")
  async getCharacter(@Param("id") id: string): Promise<any> {
    return await this.filmService.findOne(id);
  }
}
