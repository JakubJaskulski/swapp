import { Injectable } from "@nestjs/common";
import { SwapiService, SwapiVehicle } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Vehicle } from "./vehicle.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { Raw } from "typeorm";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: BaseRepository<Vehicle>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiVehicle[]> {
    const cachedFilms = await this.vehicleRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiVehicles = await this.swapiService.getSwapiVehicles(
      search,
      page,
    );

    swapiVehicles.forEach((swapiVehicle) => {
      this.vehicleRepository.upsertWithArrayMerge(swapiVehicle, "url", [
        "search",
      ]);
    });

    return swapiVehicles.map((swapiVehicle) => {
      delete swapiVehicle["search"];
      delete swapiVehicle["page"];
      return swapiVehicle;
    });
  }

  async findOne(id): Promise<SwapiVehicle> {
    return await this.swapiService.getSwapiVehicle(id);
  }
}
