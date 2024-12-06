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
    return await this.speciesService.getSpeciess(search, page);
  }

  @Get("id/:id")
  async getOneSpecies(@Param("id") id: number): Promise<Species> {
    return await this.speciesService.getSpeciesById(id);
  }
}
