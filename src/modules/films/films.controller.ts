import { Controller, Get, Param, Query } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { Film } from "./film.entity";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @Get()
  async getFilms(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Omit<Film, "search" | "page">[]> {
    return await this.filmService.findAll(search, page);
  }

  @Get("id/:id")
  async getFilm(@Param("id") id: string): Promise<Film> {
    return await this.filmService.findOne(id);
  }

  @Get("unique-crawl-words")
  async getUniqueWordsFromOpeningCrawls(): Promise<{ [p: string]: number }[]> {
    return await this.filmService.getUniqueWordsFromOpeningCrawls();
  }

  @Get("character-most-occurrences")
  async getCharacterNameWithMostOccurrencesInOpeningCrawls(): Promise<
    string | string[]
  > {
    return await this.filmService.getCharacterNameWithMostOccurrencesInOpeningCrawls();
  }
}
