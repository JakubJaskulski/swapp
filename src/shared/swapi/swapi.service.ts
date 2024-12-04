import { Injectable, Logger } from "@nestjs/common";
import { ExternalApiService } from "./external-api.service";

@Injectable()
export class SwapiService {
  private readonly logger = new Logger(SwapiService.name);
  constructor(private readonly externalApiService: ExternalApiService) {}

  async getSwapiFilms(): Promise<SwapiFilm[]> {
    const swapiFilmResponse = await this.externalApiService.fetch<
      SwapiResponse<SwapiFilm>
    >("https://swapi.dev/api/films");
    return swapiFilmResponse.results;
  }

  async getSwapiFilm(id): Promise<SwapiFilm> {
    return this.externalApiService.fetch<SwapiFilm>(
      `https://swapi.dev/api/films/${id}`,
    );
  }
}

export type SwapiResponse<T> = {
  count: number;
  next: any;
  previous: any;
  results: T[];
};

export type SwapiFilm = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
};
