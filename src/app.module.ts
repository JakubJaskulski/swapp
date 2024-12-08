import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilmsModule } from "./modules/films/films.module";
import { SwapiModule } from "./shared/swapi/swapi.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PlanetsModule } from "./modules/planets/planets.module";
import { SpeciesModule } from "./modules/species/species.module";
import { StarshipsModule } from "./modules/starships/starships.module";
import { VehiclesModule } from "./modules/vehicles/vehicles.module";
import { CharactersModule } from "./modules/characters/characters.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useFactory: async (configService: ConfigService) => ({
        type: "postgres", // Database type (change as needed)
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService], // Inject ConfigService to get values from the .env file
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
