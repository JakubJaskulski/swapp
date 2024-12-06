import { Controller, Get, Param, Query } from "@nestjs/common";
import { StarshipsService } from "./starships.service";
import { Starship } from "./starship.entity";

@Controller("starship")
export class StarshipsController {
  constructor(private readonly starshipService: StarshipsService) {}

  @Get()
  async getStarships(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Starship[]> {
    return await this.starshipService.getStarships(search, page);
  }

  @Get("id/:id")
  async getStarship(@Param("id") id: number): Promise<Starship> {
    return await this.starshipService.getStarshipById(id);
  }
}
