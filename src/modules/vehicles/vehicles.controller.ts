import { Controller, Get, Param, Query } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { Vehicle } from "./vehicle.entity";

@Controller("vehicle")
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Get()
  async getVehicles(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Vehicle[]> {
    return await this.vehicleService.findAll(search, page);
  }

  @Get(":id")
  async getVehicle(@Param("id") id: string): Promise<Vehicle> {
    return await this.vehicleService.findOne(id);
  }
}
