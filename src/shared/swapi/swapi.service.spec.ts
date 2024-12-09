import { Test, TestingModule } from "@nestjs/testing";
import { SwapiService, SwapiResponse, SwapiResource } from "./swapi.service";
import { ExternalApiService } from "./external-api.service";
import { ConfigService } from "@nestjs/config";

describe("SwapiService", () => {
  let swapiService: SwapiService;
  let externalApiService: ExternalApiService;
  let _configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
        {
          provide: ExternalApiService,
          useValue: {
            fetch: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "SWAPI_BASE_API") return "https://swapi.dev/api/";
              if (key === "SWAPP_BASE_API") return "localhost:3000/";
              return null;
            }),
          },
        },
      ],
    }).compile();

    swapiService = module.get<SwapiService>(SwapiService);
    externalApiService = module.get<ExternalApiService>(ExternalApiService);
    _configService = module.get<ConfigService>(ConfigService);
  });

  describe("getAll", () => {
    it("should fetch all resources with pagination and map URLs", async () => {
      const mockResponse: SwapiResponse<SwapiResource> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            url: "https://swapi.dev/api/people/1/",
            search: [],
            page: 1,
            films: ["https://swapi.dev/api/films/1/"],
          } as SwapiResource,
        ],
      };

      jest
        .spyOn(externalApiService, "fetch")
        .mockResolvedValueOnce(mockResponse);

      const elements = { search: "Luke", page: 1 };
      const result = await swapiService.getAll("people", elements);

      expect(result).toEqual([
        {
          url: "localhost:3000/characters/id/1/",
          search: ["Luke"],
          page: 1,
          films: ["localhost:3000/films/id/1/"],
        } as SwapiResource,
      ]);
    });

    it("should fetch all resources across multiple pages and map URLs", async () => {
      const page1Response: SwapiResponse<SwapiResource> = {
        count: 4,
        next: "https://swapi.dev/api/people/?page=2",
        previous: null,
        results: [
          {
            url: "https://swapi.dev/api/people/1/",
            search: [],
            page: 1,
            films: ["https://swapi.dev/api/films/1/"],
          } as SwapiResource,
        ],
      };
      const page2Response: SwapiResponse<SwapiResource> = {
        count: 4,
        next: null,
        previous: "https://swapi.dev/api/people/?page=1",
        results: [
          {
            url: "https://swapi.dev/api/people/2/",
            search: [],
            page: 2,
            films: ["https://swapi.dev/api/films/1/"],
          } as SwapiResource,
        ],
      };

      jest
        .spyOn(externalApiService, "fetch")
        .mockResolvedValueOnce(page1Response)
        .mockResolvedValueOnce(page2Response);

      const elements = { search: "Luke" };
      const result = await swapiService.getAll("people", elements);

      expect(result).toMatchObject([
        {
          url: "localhost:3000/characters/id/1/",
          search: ["Luke"],
          page: 1,
          films: ["localhost:3000/films/id/1/"],
        },
        {
          url: "localhost:3000/characters/id/2/",
          search: ["Luke"],
          page: 2,
          films: ["localhost:3000/films/id/1/"],
        },
      ]);
    });
  });

  describe("getById", () => {
    it("should fetch a resource by ID and map the URL", async () => {
      const mockResource: SwapiResource = {
        url: "https://swapi.dev/api/people/1/",
        search: [],
        page: 0,
        films: ["https://swapi.dev/api/films/1/"],
      } as SwapiResource;
      jest
        .spyOn(externalApiService, "fetch")
        .mockResolvedValueOnce(mockResource);

      const elements = { id: 1 };
      const result = await swapiService.getById("people", elements);

      expect(result).toEqual({
        url: "localhost:3000/characters/id/1/",
        search: [],
        page: 0,
        films: ["localhost:3000/films/id/1/"],
      });
    });
  });
});
