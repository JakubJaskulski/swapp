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

  async findAll(search?: string, page?: number): Promise<SwapiPlanet[]> {
    const cachedFilms = await this.planetRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiPlanets = await this.swapiService.getSwapiPlanets(search, page);

    swapiPlanets.forEach((swapiPlanet) => {
      this.planetRepository.upsertWithArrayMerge(swapiPlanet, "url", [
        "search",
      ]);
    });

    return swapiPlanets.map((swapiPlanet) => {
      delete swapiPlanet["search"];
      delete swapiPlanet["page"];
      return swapiPlanet;
    });
  }

  async findOne(id): Promise<SwapiPlanet> {
    return await this.swapiService.getSwapiPlanet(id);
  }
}
