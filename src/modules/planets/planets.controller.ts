import { Controller, Get, Param, Query } from "@nestjs/common";
import { PlanetsService } from "./planets.service";
import { Planet } from "./planet.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("planets")
export class PlanetsController {
  constructor(private readonly planetService: PlanetsService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved planets" })
  @ApiNotFoundResponse({ description: "Planets not found" })
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
  async getPlanets(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Planet[]> {
    return await this.planetService.getPlanets(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved planet by id" })
  @ApiNotFoundResponse({ description: "Planet not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a planet",
  })
  @Get("id/:id")
  async getPlanet(@Param("id") id: number): Promise<Planet> {
    return await this.planetService.getPlanetById(id);
  }
}
