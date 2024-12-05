import { Module } from "@nestjs/common";
import { VehiclesController } from "./vehicles.controller";
import { VehiclesService } from "./vehicles.service";
import { SwapiModule } from "../../shared/swapi/swapi.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicle } from "./vehicle.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { DataSource } from "typeorm";

@Module({
  imports: [SwapiModule, TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: "VehicleRepository",
      useFactory: (dataSource) =>
        new BaseRepository<Vehicle>(Vehicle, dataSource),
      inject: [DataSource],
    },
  ],
})
export class VehiclesModule {}
