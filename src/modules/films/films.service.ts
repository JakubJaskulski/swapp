import { Inject, Injectable } from "@nestjs/common";
import { SwapiFilm, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw } from "typeorm";
import { Film } from "./film.entity";
import { BaseRepository } from "../../repositories/swapp-repository";

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    @Inject("FilmRepository")
    private readonly filmsRepository: BaseRepository<Film>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<Film[]> {
    const cachedFilms = await this.filmsRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiFilms = await this.swapiService.getSwapiFilms(search, page);

    swapiFilms.forEach((swapiFilm) => {
      this.filmsRepository.upsertWithArrayMerge(swapiFilm, "url", ["search"]);
    });

    return swapiFilms.map((swapiFilm) => {
      delete swapiFilm["search"];
      delete swapiFilm["page"];
      return swapiFilm;
    });
  }

  async findOne(id): Promise<Film> {
    return await this.swapiService.getSwapiFilm(id);
  }
}
