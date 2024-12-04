import { Injectable } from "@nestjs/common";
import { SwapiService, SwapiVehicle } from "../../shared/swapi/swapi.service";
import { filter } from "lodash";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "./vehicle.entity";

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly filmsRepository: Repository<Vehicle>,
    private readonly swapiService: SwapiService,
  ) {}

  async findAll(dataFilter: Partial<SwapiVehicle>): Promise<SwapiVehicle[]> {
    const dbFilms = await this.filmsRepository.find();

    if (dbFilms && dbFilms.length > 0) {
      return dbFilms;
    }

    const swapiVehicals = await this.swapiService.getSwapiVehicles();

    await this.filmsRepository.save(swapiVehicals);

    return filter(swapiVehicals, dataFilter);
  }

  async findOne(id): Promise<SwapiVehicle> {
    return await this.swapiService.getSwapiVehicle(id);
  }
}
