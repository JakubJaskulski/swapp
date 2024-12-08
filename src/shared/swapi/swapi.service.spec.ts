import { SwapiService } from "./swapi.service";
import { ExternalApiService } from "./external-api.service";
import { ConfigService } from "@nestjs/config";

jest.mock("./external-api.service");
jest.mock("@nestjs/config");

describe("SwapiService", () => {
  let swapiService: SwapiService;
  let externalApiService: jest.Mocked<ExternalApiService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    externalApiService = new ExternalApiService(
      null,
    ) as jest.Mocked<ExternalApiService>;
    configService = new ConfigService() as jest.Mocked<ConfigService>;

    configService.get.mockReturnValue("https://swapi.dev/api");

    swapiService = new SwapiService(externalApiService, configService);
  });

  describe("getAll", () => {
    it("should construct the URL and fetch data from external API", async () => {
      const entityName = "films";
      const elements = { search: "star", page: 1 };

      const mockResponse = {
        results: [
          { title: "A New Hope", url: "https://swapi.dev/api/films/1/" },
        ],
      };
      externalApiService.fetch.mockResolvedValue(mockResponse);

      const result = await swapiService.getAll(entityName, elements);

      expect(externalApiService.fetch).toHaveBeenCalledWith(
        "https://swapi.dev/api/films?search=star&page=1",
      );

      expect(result).toEqual([
        {
          title: "A New Hope",
          url: "https://swapi.dev/api/films/1/",
          search: ["star"],
          page: 1,
        },
      ]);
    });

    it("should return empty array if no results are found", async () => {
      const entityName = "films";
      const elements = { search: "nonexistent", page: 1 };

      const mockResponse = { results: [] };
      externalApiService.fetch.mockResolvedValue(mockResponse);

      const result = await swapiService.getAll(entityName, elements);

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should construct the URL and fetch data by ID from external API", async () => {
      const entityName = "films";
      const elements = { id: 1, search: undefined, page: 1 };

      const mockResponse = {
        title: "A New Hope",
        url: "https://swapi.dev/api/films/1/",
      };
      externalApiService.fetch.mockResolvedValue(mockResponse);

      const result = await swapiService.getById(entityName, elements);

      expect(externalApiService.fetch).toHaveBeenCalledWith(
        "https://swapi.dev/api/films/1",
      );

      expect(result).toEqual({
        title: "A New Hope",
        url: "https://swapi.dev/api/films/1/",
      });
    });
  });

  describe("buildSwapiUrl", () => {
    it("should build URL with search and page parameters", () => {
      const elements = { search: "star", page: 1 };
      const entityName = "films";

      const url = swapiService["buildSwapiUrl"](entityName, elements);

      expect(url).toBe("https://swapi.dev/api/films?search=star&page=1");
    });

    it("should build URL with ID", () => {
      const elements = { id: 1 };
      const entityName = "films";

      const url = swapiService["buildSwapiUrl"](entityName, elements);

      expect(url).toBe("https://swapi.dev/api/films/1");
    });

    it("should build URL without search and page when not provided", () => {
      const elements = {};
      const entityName = "films";

      const url = swapiService["buildSwapiUrl"](entityName, elements);

      expect(url).toBe("https://swapi.dev/api/films");
    });
  });
});
