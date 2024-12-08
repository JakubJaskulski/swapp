import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { Raw, FindOptionsWhere } from "typeorm";
import { BaseRepository } from "../repositories/swapp-repository";
import { SwapiResource, SwapiService } from "../shared/swapi/swapi.service";

@Injectable()
export abstract class GenericEntityService<T extends SwapiResource> {
  protected readonly logger = new Logger(GenericEntityService.name);

  protected constructor(
    private readonly repository: BaseRepository<T>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(
    entityName: string,
    search?: string,
    page?: number,
  ): Promise<T[]> {
    try {
      this.logger.debug(`Fetching entities of type ${entityName}`);
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
        this.logger.debug(
          `Returning ${cachedEntities.length} cached entities.`,
        );
        return cachedEntities;
      }

      this.logger.debug(
        `No cached entities found. Fetching from external service for type ${entityName}.`,
      );

      const swapiEntities = await this.swapiService.getAll<T>(entityName, {
        search,
        page,
      });

      swapiEntities.forEach((swapiEntity) => {
        this.repository.upsertWithArrayMerge(swapiEntity as Partial<T>, "url", [
          "search",
        ]);
      });

      this.logger.debug(
        `Fetched and stored ${swapiEntities.length} entities of type ${entityName} from external service.`,
      );

      return swapiEntities.map((swapiEntity) => {
        delete swapiEntity["search"];
        delete swapiEntity["page"];
        return swapiEntity;
      });
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching entities of type ${entityName}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to fetch entities of type ${entityName}`,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne<T extends SwapiResource>(
    entityName: string,
    id: number,
  ): Promise<T> {
    let entity;

    try {
      this.logger.debug(`Fetching entity of type ${entityName} with ID ${id}`);
      entity = await this.swapiService.getById<T>(entityName, { id });

      this.logger.debug(
        `Successfully fetched entity of type ${entityName} with ID ${id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching entity of type ${entityName} with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to fetch entity of type ${entityName} with ID ${id}`,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!entity) {
      this.logger.warn(`Entity of type ${entityName} with ID ${id} not found.`);
      throw new HttpException(
        `Entity of type ${entityName} with ID ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }
}
