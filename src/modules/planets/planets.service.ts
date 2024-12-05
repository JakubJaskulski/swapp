import { Injectable } from "@nestjs/common";
import { SwapiPlanet, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw } from "typeorm";
import { Planet } from "./planet.entity";
import { BaseRepository } from "../../repositories/swapp-repository";

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: BaseRepository<Planet>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiPlanet[]> {
    const cachedFilms = await this.planetRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiFilms = await this.swapiService.getSwapiPlanets(search, page);

    swapiFilms.forEach((swapiFilm) => {
      this.planetRepository.upsertWithArrayMerge(swapiFilm, "url", ["search"]);
    });

    return swapiFilms;
  }

  async findOne(id): Promise<SwapiPlanet> {
    return await this.swapiService.getSwapiPlanet(id);
  }
}
