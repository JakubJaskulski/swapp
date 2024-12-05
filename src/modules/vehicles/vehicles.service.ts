import { Injectable } from "@nestjs/common";
import { SwapiService, SwapiVehicle } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(search: string, page: number): Promise<SwapiVehicle[]> {
    const dbFilms = await this.vehicleRepository.find();

    if (dbFilms && dbFilms.length > 0) {
      return dbFilms;
    }

    const swapiVehicles = await this.swapiService.getSwapiVehicles(
      search,
      page,
    );

    await this.vehicleRepository.save(swapiVehicles);

    return swapiVehicles;
  }

  async findOne(id): Promise<SwapiVehicle> {
    return await this.swapiService.getSwapiVehicle(id);
  }
}
