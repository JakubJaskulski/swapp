import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApiService } from './external-api.service';
import { HttpService } from '@nestjs/axios';
import { SwapiError } from '../errors/errors';
import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

describe('ExternalApiService', () => {
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

    describe('fetch', () => {
        it('should return data when the request is successful', async () => {
            const mockData = { key: 'value' };
            jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({ data: mockData });

            const result = await service.fetch<typeof mockData>('http://example.com');
            expect(result).toEqual(mockData);
            expect(httpService.axiosRef.get).toHaveBeenCalledWith('http://example.com');
        });

        it('should throw a SwapiError with appropriate status and message for Axios errors', async () => {
            const axiosError: Partial<AxiosError> = {
                response: {
                    status: HttpStatus.NOT_FOUND,
                    data: { message: 'Resource not found' }, statusText: null, headers: null, config: null
                },
                isAxiosError: true,
            };
            jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(axiosError);

            await expect(service.fetch('http://example.com')).rejects.toThrowError(
                new SwapiError(HttpStatus.NOT_FOUND, 'Resource not found'),
            );
            expect(httpService.axiosRef.get).toHaveBeenCalledWith('http://example.com');
        });

        it('should throw a SwapiError with default status and message if AxiosError has no response', async () => {
            const axiosError: Partial<AxiosError> = {
                isAxiosError: true,
                response: undefined,
            };
            jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(axiosError);

            await expect(service.fetch('http://example.com')).rejects.toThrowError(
                new SwapiError(HttpStatus.BAD_GATEWAY, 'Failed to fetch data'),
            );
        });

        it('should throw a SwapiError with INTERNAL_SERVER_ERROR for non-Axios errors', async () => {
            const nonAxiosError = new Error('Unexpected error');
            jest.spyOn(httpService.axiosRef, 'get').mockRejectedValueOnce(nonAxiosError);

            await expect(service.fetch('http://example.com')).rejects.toThrowError(
                new SwapiError(HttpStatus.INTERNAL_SERVER_ERROR, 'Error: Unexpected error'),
            );
        });
    });
});