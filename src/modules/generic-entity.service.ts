import { Injectable } from "@nestjs/common";
import { Raw, FindOptionsWhere } from "typeorm";
import { BaseRepository } from "../repositories/swapp-repository";
import { SwapiResource, SwapiService } from "../shared/swapi/swapi.service";

@Injectable()
export abstract class GenericEntityService<T extends SwapiResource> {
  protected constructor(
    private readonly repository: BaseRepository<T>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(
    entityName: string,
    search?: string,
    page?: number,
  ): Promise<T[]> {
    let whereCondition: FindOptionsWhere<T> = {};

    if (search) {
      whereCondition = {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
      } as FindOptionsWhere<T>;
    }

    if (page) {
      whereCondition = {
        ...whereCondition,
        page,
      };
    }

    const cachedEntities = await this.repository.find({
      where: whereCondition,
    });

    if (cachedEntities && cachedEntities.length > 0) {
      return cachedEntities;
    }

    const swapiEntities = await this.swapiService.getAll<T>(entityName, {
      search,
      page,
    });

    swapiEntities.forEach((swapiEntity) => {
      this.repository.upsertWithArrayMerge(swapiEntity as Partial<T>, "url", [
        "search",
      ]);
    });

    return swapiEntities.map((swapiEntity) => {
      delete swapiEntity["search"];
      delete swapiEntity["page"];
      return swapiEntity;
    });
  }

  async findOne<T extends SwapiResource>(
    entityName: string,
    id: number,
  ): Promise<T> {
    return await this.swapiService.getById<T>(entityName, { id });
  }
}
