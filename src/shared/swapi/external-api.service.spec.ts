import { Test, TestingModule } from "@nestjs/testing";
import { HttpService } from "@nestjs/axios";
import { AxiosError, AxiosResponse } from "axios";
import { ExternalApiService } from "./external-api.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("ExternalApiService", () => {
  let service: ExternalApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalApiService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExternalApiService>(ExternalApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("fetch", () => {
    const url = "https://api.example.com/resource";

    it("should return data on successful fetch", async () => {
      const mockResponse: AxiosResponse = {
        data: { key: "value" },
        status: 200,
        statusText: "OK",
        headers: {},
        config: { headers: null },
      };
      jest.spyOn(httpService.axiosRef, "get").mockResolvedValue(mockResponse);

      const result = await service.fetch<{ key: string }>(url);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an HttpException on Axios error", async () => {
      const axiosError: AxiosError = {
        name: "",
        stack: "",
        isAxiosError: true,
        response: {
          status: HttpStatus.BAD_REQUEST,
          statusText: "Bad Request",
          data: { message: "Bad Request" },
          headers: {},
          config: { headers: null },
        },
        message: "Request failed",
        config: { headers: null },
        toJSON: () => ({}),
      };
      jest.spyOn(httpService.axiosRef, "get").mockRejectedValue(axiosError);

      await expect(service.fetch(url)).rejects.toThrow(HttpException);
      await expect(service.fetch(url)).rejects.toThrow(
        `Failed to fetch data from external API: ${axiosError.message}`,
      );
    });

    it("should throw an HttpException on unexpected error", async () => {
      const unexpectedError = new Error("Unexpected error occurred");
      jest
        .spyOn(httpService.axiosRef, "get")
        .mockRejectedValue(unexpectedError);

      await expect(service.fetch(url)).rejects.toThrow(HttpException);
      await expect(service.fetch(url)).rejects.toThrow(
        "Unexpected error occurred while fetching data.",
      );
    });
  });
});
