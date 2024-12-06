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
    return await this.vehicleService.getVehicles(search, page);
  }

  @Get("id/:id")
  async getVehicle(@Param("id") id: number): Promise<Vehicle> {
    return await this.vehicleService.getVehicleById(id);
  }
}
