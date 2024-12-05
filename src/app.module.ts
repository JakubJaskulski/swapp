import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilmsModule } from "./modules/films/films.module";
import { SwapiModule } from "./shared/swapi/swapi.module";
import { ConfigModule } from "@nestjs/config";
import { PlanetsModule } from "./modules/planets/planets.module";
import { SpeciesModule } from "./modules/species/species.module";
import { StarshipsModule } from "./modules/starships/starships.module";
import { VehiclesModule } from "./modules/vehicles/vehicles.module";
import { CharactersModule } from "./modules/characters/characters.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "root",
      password: "root",
      database: "test_db",
      autoLoadEntities: true,
      synchronize: true,
    }),
    FilmsModule,
    PlanetsModule,
    SpeciesModule,
    StarshipsModule,
    VehiclesModule,
    CharactersModule,
    SwapiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, ".env"],
    }),
  ],
})
export class AppModule {}
