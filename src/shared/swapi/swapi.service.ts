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

  async getAll<T extends SwapiResource>(
    entityName: string,
    elements: UrlElements,
  ): Promise<T[]> {
    const swapiResults: T[] = [];
    let swapiResponse: SwapiResponse<T>;

    if (elements.page) {
      swapiResponse = await this.getResponseByPage(entityName, elements);
      return swapiResponse.results.map((result) => {
        return { ...result, search: [elements.search], page: elements.page };
      });
    } else {
      let page = 0;
      do {
        page++;
        const updatedElements = { ...elements, page };
        const url = this.buildSwapiUrl(entityName, updatedElements);

        swapiResponse =
          await this.externalApiService.fetch<SwapiResponse<T>>(url);
        swapiResults.push(
          ...swapiResponse.results.map((result) => {
            return {
              ...result,
              search: [updatedElements.search],
              page: updatedElements.page,
            };
          }),
        );
      } while (swapiResponse.next);
    }

    return swapiResults;
  }

  private async getResponseByPage<SwapiResponse>(
    entityName: string,
    elements: UrlElements,
  ): Promise<SwapiResponse> {
    const url = this.buildSwapiUrl(entityName, elements);
    return await this.externalApiService.fetch<SwapiResponse>(url);
  }

  async getById<T extends SwapiResource>(
    entityName: string,
    elements: UrlElements,
  ): Promise<T> {
    const url = this.buildSwapiUrl(entityName, elements);
    return await this.externalApiService.fetch<T>(url);
  }

  private buildSwapiUrl(entityName: string, elements: UrlElements) {
    const url = new URL(`${this.baseUrl}/${entityName}`);

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

export type SwapiFilm = SwapiResource & {
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

export type SwapiCharacter = SwapiResource & {
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

export type SwapiPlanet = SwapiResource & {
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

export type SwapiSpecies = SwapiResource & {
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

export type SwapiStarship = SwapiResource & {
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

export type SwapiVehicle = SwapiResource & {
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

export type SwapiResource = {
  url: string;
  search: string[] | undefined;
  page: number;
};
