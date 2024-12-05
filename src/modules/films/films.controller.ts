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
  ): Promise<Film[]> {
    return await this.filmService.findAll(search, page);
  }

  @Get(":id")
  async getFilm(@Param("id") id: string): Promise<Film> {
    return await this.filmService.findOne(id);
  }
}
