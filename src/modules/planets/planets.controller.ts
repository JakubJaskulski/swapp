import { Body, Controller, Get, Param } from "@nestjs/common";
import { PlanetsService } from "./planets.service";
import { Planet } from "./planet.entity";

@Controller("planets")
export class PlanetsController {
  constructor(private readonly planetService: PlanetsService) {}

  @Get()
  async getPlanets(@Body() filter: any): Promise<Planet[]> {
    return await this.planetService.findAll(filter);
  }

  @Get(":id")
  async getPlanet(@Param("id") id: string): Promise<Planet> {
    return await this.planetService.findOne(id);
  }
}
