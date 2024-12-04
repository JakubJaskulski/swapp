import { Module } from "@nestjs/common";
import { SwapiService } from "./swapi.service";
import { HttpModule } from "@nestjs/axios";
import { ExternalApiService } from "./external-api.service";

@Module({
  imports: [HttpModule],
  providers: [SwapiService, ExternalApiService],
  exports: [SwapiService],
})
export class SwapiModule {}
