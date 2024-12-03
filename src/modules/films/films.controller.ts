import {Controller, Get, Param} from '@nestjs/common';
import {FilmsService} from "./films.service";

@Controller('films')
export class FilmsController {
    constructor(private readonly filmService: FilmsService) {}

    @Get()
    async getFilms(): Promise</* TBD */ any[]> {
        return this.filmService.findAll();
    }

    @Get(':id')
    async getFilm(@Param('id') id: string): Promise<any> {
        return this.filmService.findOne(id);
    }
}
