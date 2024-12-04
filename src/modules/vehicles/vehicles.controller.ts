import { Body, Controller, Get, Param } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";

@Controller("films")
export class VehiclesController {
  constructor(private readonly filmService: VehiclesService) {}

  @Get()
  async getFilms(@Body() filter: any): Promise</* TBD */ any[]> {
    return await this.filmService.findAll(filter);
  }

  @Get(":id")
  async getFilm(@Param("id") id: string): Promise<any> {
    return await this.filmService.findOne(id);
  }
}
