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

    const swapiFilms = await this.swapiService.getSwapiSpecies(search, page);

    swapiFilms.forEach((swapiFilm) => {
      this.speciesRepository.upsertWithArrayMerge(swapiFilm, "url", ["search"]);
    });

    return swapiFilms;
  }

  async findOne(id): Promise<SwapiSpecies> {
    return await this.swapiService.getOneSwapiSpecies(id);
  }
}
