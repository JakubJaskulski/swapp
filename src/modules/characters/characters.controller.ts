import { Controller, Get, Param, Query } from "@nestjs/common";
import { CharactersService } from "./characters.service";
import { Character } from "./character.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("characters")
export class CharactersController {
  constructor(private readonly characterService: CharactersService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved characters" })
  @ApiNotFoundResponse({ description: "Characters not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by name",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination (if not specified return all)",
  })
  async getCharacters(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Character[]> {
    return await this.characterService.getCharacters(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved character by id" })
  @ApiNotFoundResponse({ description: "Character not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a character",
  })
  async getCharacter(@Param("id") id: number): Promise<Character> {
    return await this.characterService.getCharacterById(id);
  }
}
