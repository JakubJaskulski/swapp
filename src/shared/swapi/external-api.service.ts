import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import { isAxiosError } from 'axios';
import {SwapiError} from "../errors/errors";

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
                const message =
                    (error.response?.data as { message?: string })?.message ||
                    'Failed to fetch data';
                throw new SwapiError(statusCode, message)
            }

            throw new SwapiError(HttpStatus.INTERNAL_SERVER_ERROR, String(error))
        }
    }
}

