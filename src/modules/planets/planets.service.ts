import { Injectable } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Planet } from "./planet.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { GenericEntityService } from "../generic-entity.service";

@Injectable()
export class PlanetsService extends GenericEntityService<Planet> {
  constructor(
    @InjectRepository(Planet)
    private readonly planetRepository: BaseRepository<Planet>,
    swapiService: SwapiService,
  ) {
    super(planetRepository, swapiService);
  }

  async getPlanets(search?: string, page?: number): Promise<Planet[]> {
    return this.findAll(Planet.swapiName, search, page);
  }

  async getPlanetById(id: number): Promise<Planet> {
    return this.findOne(Planet.swapiName, id);
  }
}
