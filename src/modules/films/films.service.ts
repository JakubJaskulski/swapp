import { Injectable } from "@nestjs/common";
import { SwapiFilm, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Film } from "./film.entity";

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiFilm[]> {
    const dbFilms = await this.filmsRepository.find();

    if (dbFilms && dbFilms.length > 0) {
      return dbFilms;
    }

    const swapiFilms = await this.swapiService.getSwapiFilms(search, page);

    await this.filmsRepository.save(swapiFilms);

    return swapiFilms;
  }

  async findOne(id): Promise<SwapiFilm> {
    return await this.swapiService.getSwapiFilm(id);
  }
}
