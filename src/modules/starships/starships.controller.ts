import { Body, Controller, Get, Param } from "@nestjs/common";
import { StarshipsService } from "./starships.service";

@Controller("films")
export class StarshipsController {
  constructor(private readonly filmService: StarshipsService) {}

  @Get()
  async getStarships(@Body() filter: any): Promise</* TBD */ any[]> {
    return await this.filmService.findAll(filter);
  }

  @Get(":id")
  async getStarship(@Param("id") id: string): Promise<any> {
    return await this.filmService.findOne(id);
  }
}
