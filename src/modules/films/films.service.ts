import { Injectable } from "@nestjs/common";
import { SwapiFilm, SwapiService } from "../../shared/swapi/swapi.service";
import { filter } from "lodash";

@Injectable()
export class FilmsService {
  constructor(private readonly swapiService: SwapiService) {}

  async findAll(dataFilter: Partial<SwapiFilm>): Promise<SwapiFilm[]> {
    const swapiFilms = await this.swapiService.getSwapiFilms();
    return filter(swapiFilms, dataFilter);
  }

  async findOne(id): Promise<SwapiFilm> {
    return await this.swapiService.getSwapiFilm(id);
  }
}
