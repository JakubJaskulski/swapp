import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {catchError, firstValueFrom} from "rxjs";
import axios, { AxiosError } from 'axios';

@Injectable()
export class FilmsService {
    private readonly logger = new Logger(FilmsService.name);
    constructor(private readonly httpService: HttpService) {}

    async findAll(): Promise<SwapiFilm[]> {
        const { data } = await firstValueFrom(
            this.httpService
                .get<SwapiResponse<SwapiFilm>>(`https://swapi.dev/api/films`)
                .pipe(
                    catchError((error: AxiosError) => {
                        if (axios.isAxiosError(error)) {
                            const statusCode = error.response?.status || HttpStatus.BAD_GATEWAY;
                            const message = (error.response?.data as ApiResponse)?.message || "Failed to fetch data";

                            console.error("Axios error:", {
                                message: error.message,
                                statusCode,
                                response: error.response?.data,
                            });

                            throw new HttpException(
                                {
                                    statusCode,
                                    message,
                                    error: error.message,
                                },
                                statusCode,
                            );
                        }
                        throw new HttpException(
                            {
                                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: "An unexpected error occurred",
                                error: String(error),
                            },
                            HttpStatus.INTERNAL_SERVER_ERROR,
                        );

                    }),
                ),
        );

        return data.results
    }

    async findOne(id): Promise<SwapiFilm> {
        const { data } = await firstValueFrom(
            this.httpService
                .get<
                    SwapiFilm
                >(`https://swapi.dev/api/films/${id}`)
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response.data);
                        //TBD
                        throw 'An error happened';
                    }),
                ),
        );

        return data
    }
}

type SwapiResponse<T> = {
    "count": number,
    "next": any,
    "previous": any,
    results: T[]
}

type SwapiFilm = {
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
}

interface ApiResponse {
    message: string;
    [key: string]: any;
}


class SwapiError extends Error {
    public statusCode?: number;
    public responseData?: any;

    constructor(message: string, statusCode?: number, responseData?: any) {
        super(message);
        this.name = "SwapiError";
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}