import { Injectable } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Vehicle } from "./vehicle.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { GenericEntityService } from "../generic-entity.service";

@Injectable()
export class VehiclesService extends GenericEntityService<Vehicle> {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: BaseRepository<Vehicle>,
    swapiService: SwapiService,
  ) {
    super(vehicleRepository, swapiService);
  }

  async getVehicles(search?: string, page?: number): Promise<Vehicle[]> {
    return this.findAll(Vehicle.swapiName, search, page);
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return this.findOne(Vehicle.swapiName, id);
  }
}
