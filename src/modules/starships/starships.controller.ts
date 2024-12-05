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
    return await this.starshipService.findAll(search, page);
  }

  @Get(":id")
  async getStarship(@Param("id") id: string): Promise<Starship> {
    return await this.starshipService.findOne(id);
  }
}
