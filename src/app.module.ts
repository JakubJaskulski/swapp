import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilmsModule } from "./modules/films/films.module";
import { SwapiModule } from "./shared/swapi/swapi.module";

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
    SwapiModule,
  ],
})
export class AppModule {}
