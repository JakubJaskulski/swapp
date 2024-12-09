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
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>("DB_HOST");
        const dbPort = configService.get<number>("DB_PORT");
        const dbUsername = configService.get<string>("DB_USERNAME");
        const dbPassword = configService.get<string>("DB_PASSWORD");
        const dbName = configService.get<string>("DB_NAME");

        console.log("Database connection details:");
        console.log(`DB_HOST: ${dbHost}`);
        console.log(`DB_PORT: ${dbPort}`);
        console.log(`DB_USERNAME: ${dbUsername}`);
        console.log(`DB_NAME: ${dbName}`);

        return {
          type: "postgres",
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
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
