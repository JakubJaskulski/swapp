import { Module } from "@nestjs/common";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicle } from "./vehicle.entity";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
