import { Controller, Get, Param, Query } from "@nestjs/common";
import { SpeciesService } from "./species.service";
import { Species } from "./species.entity";

@Controller("species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  async getSpecies(
    @Query("search") search: string,
    @Query("page") page: number,
  ): Promise<Species[]> {
    return await this.speciesService.findAll(search, page);
  }

  @Get(":id")
  async getOneSpecies(@Param("id") id: string): Promise<Species> {
    return await this.speciesService.findOne(id);
  }
}
