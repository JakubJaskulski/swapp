import { Controller, Get, Param, Query } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { Film } from "./film.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved films" })
  @ApiNotFoundResponse({ description: "Films not found" })
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
  async getFilms(
    @Query("search") search?: string,
    @Query("page") page?: number,
  ): Promise<Omit<Film, "search" | "page">[]> {
    return await this.filmService.getFilms(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved film by id" })
  @ApiNotFoundResponse({ description: "Film not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a film",
  })
  async getFilm(@Param("id") id: number): Promise<Film> {
    return await this.filmService.getFilmById(id);
  }

  @ApiOkResponse({
    description:
      "Successfully retrieved array of unique words with count of their occurrences in opening crawls",
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get("unique-crawl-words")
  async getUniqueWordsFromOpeningCrawls(): Promise<{ [p: string]: number }[]> {
    return await this.filmService.getUniqueWordsWithCountFromOpeningCrawls();
  }

  @Get("character-most-occurrences")
  @ApiOkResponse({
    description:
      "Successfully retrieved name of character(s) with most occurrences in opening crawls",
  })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  async getCharacterNameWithMostOccurrencesInOpeningCrawls(): Promise<
    string | string[]
  > {
    return await this.filmService.getCharacterNameWithMostOccurrencesInOpeningCrawls();
  }
}
