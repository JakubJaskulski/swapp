import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { isAxiosError } from "axios";
import { SwapiError } from "../errors/errors";

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async fetch<T>(url: string): Promise<T> {
    try {
      const response = await this.httpService.axiosRef.get<T>(url);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const statusCode = error.response?.status || HttpStatus.BAD_GATEWAY;
        if (statusCode === HttpStatus.NOT_FOUND) {
          throw new SwapiError("Resource not found", {
            url,
            statusCode,
            error: String(error),
          });
        }
      }

      throw new SwapiError("Failed to fetch data", {
        url,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: String(error),
      });
    }
  }
}
