import { Controller, Get, Param, Query } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { Species } from "./species.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved species" })
  @ApiNotFoundResponse({ description: "Species not found" })
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
  async getSpecies(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Species[]> {
    return await this.speciesService.getSpeciess(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved species by id" })
  @ApiNotFoundResponse({ description: "Species not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a species",
  })
  async getOneSpecies(@Param("id") id: number): Promise<Species> {
    return await this.speciesService.getSpeciesById(id);
  }
}
