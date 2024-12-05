import { Injectable } from "@nestjs/common";
import { SwapiSpecies, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Species } from "./species.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { Raw } from "typeorm";

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: BaseRepository<Species>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiSpecies[]> {
    const cachedFilms = await this.speciesRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiSpecies = await this.swapiService.getSwapiSpecies(search, page);

    swapiSpecies.forEach((oneSwapiSpecies) => {
      this.speciesRepository.upsertWithArrayMerge(oneSwapiSpecies, "url", [
        "search",
      ]);
    });

    return swapiSpecies.map((oneSwapiSpecies) => {
      delete oneSwapiSpecies["search"];
      delete oneSwapiSpecies["page"];
      return oneSwapiSpecies;
    });
  }

  async findOne(id): Promise<SwapiSpecies> {
    return await this.swapiService.getOneSwapiSpecies(id);
  }
}
