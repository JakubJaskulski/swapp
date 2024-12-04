import { Body, Controller, Get, Param } from "@nestjs/common";
import { PlanetsService } from "./planets.service";

@Controller("films")
export class PlanetsController {
  constructor(private readonly filmService: PlanetsService) {}

  @Get()
  async getPlanets(@Body() filter: any): Promise</* TBD */ any[]> {
    return await this.filmService.findAll(filter);
  }

  @Get(":id")
  async getPlanet(@Param("id") id: string): Promise<any> {
    return await this.filmService.findOne(id);
  }
}
