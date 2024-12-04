import { Injectable } from "@nestjs/common";
import { SwapiStarship, SwapiService } from "../../shared/swapi/swapi.service";
import { filter } from "lodash";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Starship } from "./starship.entity";

@Injectable()
export class StarshipsService {
  constructor(
    @InjectRepository(Starship)
    private readonly filmsRepository: Repository<Starship>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(dataFilter: Partial<SwapiStarship>): Promise<SwapiStarship[]> {
    const dbStarships = await this.filmsRepository.find();

    if (dbStarships && dbStarships.length > 0) {
      return dbStarships;
    }

    const swapiStarships = await this.swapiService.getSwapiStarships();

    await this.filmsRepository.save(swapiStarships);

    return filter(swapiStarships, dataFilter);
  }

  async findOne(id): Promise<SwapiStarship> {
    return await this.swapiService.getSwapiStarship(id);
  }
}
