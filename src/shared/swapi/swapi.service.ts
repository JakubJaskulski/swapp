import { Injectable } from "@nestjs/common";
import { ExternalApiService } from "./external-api.service";

@Injectable()
export class SwapiService {
  constructor(private readonly externalApiService: ExternalApiService) {}

  async getSwapiFilms(search: string, page: number): Promise<SwapiFilm[]> {
    return await this.getAll<SwapiFilm>("films", search, page);
  }

  async getSwapiFilm(id): Promise<SwapiFilm> {
    return await this.getById<SwapiFilm>("films", id);
  }

  async getSwapiCharacters(): Promise<SwapiCharacter[]> {
    return await this.getAll<SwapiCharacter>("people");
  }

  async getSwapiCharacter(id): Promise<SwapiCharacter> {
    return await this.getById("people", id);
  }

  async getSwapiPlanets(): Promise<SwapiPlanet[]> {
    return await this.getAll<SwapiPlanet>("planets");
  }

  async getSwapiPlanet(id): Promise<SwapiPlanet> {
    return await this.getById("planets", id);
  }

  async getSwapiSpecies(): Promise<SwapiSpecies[]> {
    return await this.getAll<SwapiSpecies>("species");
  }

  async getOneSwapiSpecies(id): Promise<SwapiSpecies> {
    return await this.getById("species", id);
  }

  async getSwapiStarships(): Promise<SwapiStarship[]> {
    return await this.getAll<SwapiStarship>("starships");
  }

  async getSwapiStarship(id): Promise<SwapiStarship> {
    return await this.getById("starships", id);
  }

  async getSwapiVehicles(): Promise<SwapiVehicle[]> {
    return await this.getAll<SwapiVehicle>("vehicles");
  }

  async getSwapiVehicle(id): Promise<SwapiVehicle> {
    return await this.getById("vehicles", id);
  }

  private async getAll<T>(
    entityName: string,
    search?: string,
    page?: number,
  ): Promise<T[]> {
    const baseUrl = `https://swapi.dev/api/${entityName}/`;
    const params = {
      search,
      page,
    };

    /* TBD */
    const url = new URL(baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value?.toString());
      }
    });

    const swapiResponse = await this.externalApiService.fetch<SwapiResponse<T>>(
      url.href,
    );
    return swapiResponse.results;
  }

  private async getById<T>(entityName: string, id: string): Promise<T> {
    return await this.externalApiService.fetch<T>(
      `https://swapi.dev/api/${entityName}/${id}`,
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
