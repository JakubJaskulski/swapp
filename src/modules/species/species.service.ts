import { Injectable } from "@nestjs/common";
import { SwapiSpecies, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Species } from "./species.entity";

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiSpecies[]> {
    const dbSpecies = await this.speciesRepository.find();

    if (dbSpecies && dbSpecies.length > 0) {
      return dbSpecies;
    }

    const swapiSpecies = await this.swapiService.getSwapiSpecies(search, page);

    await this.speciesRepository.save(swapiSpecies);

    return swapiSpecies;
  }

  async findOne(id): Promise<SwapiSpecies> {
    return await this.swapiService.getOneSwapiSpecies(id);
  }
}
