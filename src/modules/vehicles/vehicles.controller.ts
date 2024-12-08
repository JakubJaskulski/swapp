import { Controller, Get, Param, Query } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { Vehicle } from "./vehicle.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved vehicles" })
  @ApiNotFoundResponse({ description: "Vehicles not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by name",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number for pagination (if not specified return all)",
  })
  async getVehicles(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Vehicle[]> {
    return await this.vehicleService.getVehicles(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved vehicle by id" })
  @ApiNotFoundResponse({ description: "Vehicle not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a vehicle",
  })
  async getVehicle(@Param("id") id: number): Promise<Vehicle> {
    return await this.vehicleService.getVehicleById(id);
  }
}
