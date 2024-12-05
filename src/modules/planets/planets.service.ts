import { Injectable } from "@nestjs/common";
import { SwapiPlanet, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Planet } from "./planet.entity";

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiPlanet[]> {
    const dbPlanets = await this.planetRepository.find();

    if (dbPlanets && dbPlanets.length > 0) {
      return dbPlanets;
    }

    const swapiPlanets = await this.swapiService.getSwapiPlanets(search, page);

    await this.planetRepository.save(swapiPlanets);

    return swapiPlanets;
  }

  async findOne(id): Promise<SwapiPlanet> {
    return await this.swapiService.getSwapiPlanet(id);
  }
}
