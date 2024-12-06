import { Injectable } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Species } from "./species.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { GenericEntityService } from "../generic-entity.service";

@Injectable()
export class SpeciesService extends GenericEntityService<Species> {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: BaseRepository<Species>,
    swapiService: SwapiService,
  ) {
    super(speciesRepository, swapiService);
  }

  async getSpeciess(search?: string, page?: number): Promise<Species[]> {
    return this.findAll(Species.swapiName, search, page);
  }

  async getSpeciesById(id: number): Promise<Species> {
    return this.findOne(Species.swapiName, id);
  }
}
