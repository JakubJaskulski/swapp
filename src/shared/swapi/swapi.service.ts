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
  swappUrl = this.configService.get<string>("SWAPP_BASE_API");
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
              url: this.mapReferenceUrl(result.url),
              search: [updatedElements.search],
              page: updatedElements.page,
            };
          }),
        );
      } while (swapiResponse.next);
    }

    return this.mapAllReferences(swapiResults) as T[];
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

  mapAllReferences(resources: object[]): object[] {
    const characterRefs = [
      "characters",
      "residents",
      "people",
      "pilots",
      "pilots",
    ];
    const swapiResourceTypes = characterRefs.concat([
      "films",
      "planets",
      "species",
      "starships",
      "vehicles",
    ]);

    return resources.map((resource) => {
      const updatedResource = { ...resource };

      swapiResourceTypes.forEach((swapiResourceType) => {
        if (Array.isArray(updatedResource[swapiResourceType])) {
          updatedResource[swapiResourceType] = updatedResource[
            swapiResourceType
          ].map((resourceRefUrl) => this.mapReferenceUrl(resourceRefUrl));
        }
      });

      return updatedResource;
    });
  }

  mapReferenceUrl(swapiUrl: string): string {
    const match = swapiUrl.match(/\/api\/([^/]+)\//);
    const entityRefName = match ? match[1] : null;

    const characterRefs = [
      "characters",
      "residents",
      "people",
      "pilots",
      "pilots",
    ];

    if (characterRefs.includes(entityRefName)) {
      return swapiUrl.replace(
        `${this.baseUrl}people/`,
        `${this.swappUrl}characters/id/`,
      );
    }
    return swapiUrl.replace(
      `${this.baseUrl}${entityRefName}`,
      `${this.swappUrl}${entityRefName}/id`,
    );
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

export type SwapiResource = {
  url: string;
  search: string[] | undefined;
  page: number;
};
