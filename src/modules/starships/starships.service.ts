import { Injectable } from "@nestjs/common";
import { SwapiStarship, SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Starship } from "./starship.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { Raw } from "typeorm";

@Injectable()
export class StarshipsService {
  constructor(
    @InjectRepository(Starship)
    private readonly starshipRepository: BaseRepository<Starship>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiStarship[]> {
    const cachedFilms = await this.starshipRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiStarships = await this.swapiService.getSwapiStarships(
      search,
      page,
    );

    swapiStarships.forEach((swapiStarship) => {
      this.starshipRepository.upsertWithArrayMerge(swapiStarship, "url", [
        "search",
      ]);
    });

    return swapiStarships.map((oneSwapiStarship) => {
      delete oneSwapiStarship["search"];
      delete oneSwapiStarship["page"];
      return oneSwapiStarship;
    });
  }

  async findOne(id): Promise<SwapiStarship> {
    return await this.swapiService.getSwapiStarship(id);
  }
}
