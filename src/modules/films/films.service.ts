import {Injectable} from '@nestjs/common';
import {SwapiFilm, SwapiService} from "../../shared/swapi/swapi.service";

@Injectable()
export class FilmsService {
    constructor(private readonly swapiService: SwapiService) {}

    async findAll(): Promise<SwapiFilm[]> {
            return await this.swapiService.getSwapiFilms()
    }

    async findOne(id): Promise<SwapiFilm> {
            return await this.swapiService.getSwapiFilm(id)
    }
}
