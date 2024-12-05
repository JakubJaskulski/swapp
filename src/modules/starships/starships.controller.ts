import { Body, Controller, Get, Param } from "@nestjs/common";
import { StarshipsService } from "./starships.service";
import { Starship } from "./starship.entity";

@Controller("starship")
export class StarshipsController {
  constructor(private readonly starshipService: StarshipsService) {}

  @Get()
  async getStarships(@Body() filter: any): Promise<Starship[]> {
    return await this.starshipService.findAll(filter);
  }

  @Get(":id")
  async getStarship(@Param("id") id: string): Promise<Starship> {
    return await this.starshipService.findOne(id);
  }
}
