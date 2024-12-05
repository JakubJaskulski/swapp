import { Body, Controller, Get, Param } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { Vehicle } from "./vehicle.entity";

@Controller("vehicle")
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Get()
  async getVehicles(@Body() filter: any): Promise<Vehicle[]> {
    return await this.vehicleService.findAll(filter);
  }

  @Get(":id")
  async getVehicle(@Param("id") id: string): Promise<Vehicle> {
    return await this.vehicleService.findOne(id);
  }
}
