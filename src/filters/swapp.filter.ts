import { DbCronError, SwapiError, SwappError } from "../shared/errors/errors";
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(SwappError)
export class SwappErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(SwappErrorFilter.name);

  catch(exception: SwappError, host: ArgumentsHost) {
    if (exception instanceof DbCronError) {
      const dbCronErrorLog: ErrorLog = {
        message: exception.message,
        timestamp: new Date().toISOString(),
        error: exception,
      };
      this.logger.error(dbCronErrorLog);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    /* TBD */
    const status = exception instanceof SwapiError ? 404 : 500;

    const jsonBody = {
      message: exception.message,
      statusCode: status,
    };

    const errorLog: ErrorLog = {
      ...jsonBody,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: exception,
    };

    this.logger.error(exception, errorLog);

    response.status(status).json(jsonBody);
  }
}

type ErrorLog = {
  message: string;
  statusCode?: number;
  path?: string;
  timestamp: string;
  error: any;
};
