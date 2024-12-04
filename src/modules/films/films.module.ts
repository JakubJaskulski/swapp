import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import {SwapiModule} from "../../shared/swapi/swapi.module";

@Module({
  imports: [SwapiModule],
  controllers: [FilmsController],
  providers: [FilmsService]
})
export class FilmsModule {}
