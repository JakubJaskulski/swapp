import { Controller, Get, Param, Query } from "@nestjs/common";
import { PlanetsService } from "./planets.service";
import { Planet } from "./planet.entity";

@Controller("planets")
export class PlanetsController {
  constructor(private readonly planetService: PlanetsService) {}

  @Get()
  async getPlanets(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Planet[]> {
    return await this.planetService.getPlanets(search, page);
  }

  @Get("id/:id")
  async getPlanet(@Param("id") id: number): Promise<Planet> {
    return await this.planetService.getPlanetById(id);
  }
}
