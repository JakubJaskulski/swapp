import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { isAxiosError } from "axios";

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetch<T>(url: string): Promise<T> {
    try {
      this.logger.debug(`Fetching data from URL: ${url}`);
      const response = await this.httpService.axiosRef.get<T>(url);
      this.logger.debug(`Successfully fetched data from URL: ${url}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(
          `Axios error while fetching data from URL: ${url}`,
          error.message,
        );
        throw new HttpException(
          `Failed to fetch data from external API: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.logger.error(
          `Unexpected error while fetching data from URL: ${url}`,
          error instanceof Error ? error.message : String(error),
        );
        throw new HttpException(
          `Unexpected error occurred while fetching data.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
