import { Injectable } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Starship } from "./starship.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { GenericEntityService } from "../generic-entity.service";

@Injectable()
export class StarshipsService extends GenericEntityService<Starship> {
  constructor(
    @InjectRepository(Starship)
    private readonly starshipRepository: BaseRepository<Starship>,
    swapiService: SwapiService,
  ) {
    super(starshipRepository, swapiService);
  }

  async getStarships(search?: string, page?: number): Promise<Starship[]> {
    return this.findAll(Starship.swapiName, search, page);
  }

  async getStarshipById(id: number): Promise<Starship> {
    return this.findOne(Starship.swapiName, id);
  }
}
