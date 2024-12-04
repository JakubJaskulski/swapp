import { Body, Controller, Get, Param } from "@nestjs/common";
import { SpeciesService } from "./species.service";

@Controller("films")
export class SpeciesController {
  constructor(private readonly filmService: SpeciesService) {}

  @Get()
  async getSpecies(@Body() filter: any): Promise</* TBD */ any[]> {
    return await this.filmService.findAll(filter);
  }

  @Get(":id")
  async getOneSpecies(@Param("id") id: string): Promise<any> {
    return await this.filmService.findOne(id);
  }
}
