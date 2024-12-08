import { Controller, Get, Param, Query } from "@nestjs/common";
import { StarshipsService } from "./starships.service";
import { Starship } from "./starship.entity";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@Controller("starships")
export class StarshipsController {
  constructor(private readonly starshipService: StarshipsService) {}

  @Get()
  @ApiOkResponse({ description: "Successfully retrieved starships" })
  @ApiNotFoundResponse({ description: "Starships not found" })
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
  async getStarships(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Starship[]> {
    return await this.starshipService.getStarships(search, page);
  }

  @Get("id/:id")
  @ApiOkResponse({ description: "Successfully retrieved starship by id" })
  @ApiNotFoundResponse({ description: "Starship not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({
    name: "id",
    required: false,
    type: String,
    description: "Id of a starship",
  })
  async getStarship(@Param("id") id: number): Promise<Starship> {
    return await this.starshipService.getStarshipById(id);
  }
}
