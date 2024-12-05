import { Injectable } from "@nestjs/common";
import { ExternalApiService } from "./external-api.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SwapiService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly configService: ConfigService,
  ) {}

  baseUrl = this.configService.get<string>("SWAPI_BASE_API");

  async getSwapiFilms(search: string, page: number): Promise<SwapiFilm[]> {
    return await this.getAll<SwapiFilm>({ entityName: "films", search, page });
  }

  async getSwapiFilm(id): Promise<SwapiFilm> {
    return await this.getById<SwapiFilm>({ entityName: "films", id });
  }

  async getSwapiCharacters(
    search: string,
    page: number,
  ): Promise<SwapiCharacter[]> {
    return await this.getAll<SwapiCharacter>({
      entityName: "people",
      search,
      page,
    });
  }

  async getSwapiCharacter(id): Promise<SwapiCharacter> {
    return await this.getById({ entityName: "people", id });
  }

  async getSwapiPlanets(search: string, page: number): Promise<SwapiPlanet[]> {
    return await this.getAll<SwapiPlanet>({
      entityName: "planets",
      search,
      page,
    });
  }

  async getSwapiPlanet(id): Promise<SwapiPlanet> {
    return await this.getById({ entityName: "planets", id });
  }

  async getSwapiSpecies(search: string, page: number): Promise<SwapiSpecies[]> {
    return await this.getAll<SwapiSpecies>({
      entityName: "species",
      search,
      page,
    });
  }

  async getOneSwapiSpecies(id): Promise<SwapiSpecies> {
    return await this.getById({ entityName: "species", id });
  }

  async getSwapiStarships(
    search: string,
    page: number,
  ): Promise<SwapiStarship[]> {
    return await this.getAll<SwapiStarship>({
      entityName: "starships",
      search,
      page,
    });
  }

  async getSwapiStarship(id): Promise<SwapiStarship> {
    return await this.getById({ entityName: "starships", id });
  }

  async getSwapiVehicles(
    search: string,
    page: number,
  ): Promise<SwapiVehicle[]> {
    return await this.getAll<SwapiVehicle>({
      entityName: "vehicles",
      search,
      page,
    });
  }

  async getSwapiVehicle(id): Promise<SwapiVehicle> {
    return await this.getById({ entityName: "vehicles", id });
  }

  private async getAll<T>(elements: UrlElements): Promise<T[]> {
    const url = this.buildSwapiUrl(elements);
    const swapiResponse =
      await this.externalApiService.fetch<SwapiResponse<T>>(url);
    return swapiResponse.results;
  }

  private async getById<T>(elements: UrlElements): Promise<T> {
    const url = this.buildSwapiUrl(elements);
    return await this.externalApiService.fetch<T>(url);
  }

  private buildSwapiUrl(elements: UrlElements) {
    const url = new URL(`${this.baseUrl}/${elements.entityName}`);

    if (elements.id) {
      url.pathname = `${url.pathname}/${elements.id}`;
      return url.href;
    }

    const params = {
      search: elements.search,
      page: elements.page,
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value?.toString());
      }
    });

    return url.href;
  }
}

type UrlElements = {
  entityName: string;
  id?: number;
  search?: string;
  page?: number;
};

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

export type SwapiCharacter = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
};

export type SwapiPlanet = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type SwapiSpecies = {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type SwapiStarship = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

export type SwapiVehicle = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};
