import { Body, Controller, Get, Param } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { Species } from "./species.entity";

@Controller("species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  async getSpecies(@Body() filter: any): Promise<Species[]> {
    return await this.speciesService.findAll(filter);
  }

  @Get(":id")
  async getOneSpecies(@Param("id") id: string): Promise<Species> {
    return await this.speciesService.findOne(id);
  }
}
