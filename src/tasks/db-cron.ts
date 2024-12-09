import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "../repositories/swapp-repository";
import { Film } from "../modules/films/film.entity";
import { LessThan } from "typeorm";
import { Character } from "../modules/characters/character.entity";
import { Planet } from "../modules/planets/planet.entity";
import { Species } from "../modules/species/species.entity";
import { Starship } from "../modules/starships/starship.entity";
import { Vehicle } from "../modules/vehicles/vehicle.entity";

@Injectable()
export class CleanupService {
  private readonly repositories: BaseRepository<any>[];
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: BaseRepository<Film>,
    @InjectRepository(Character)
    private readonly characterRepository: BaseRepository<Character>,
    @InjectRepository(Planet)
    private readonly planetRepository: BaseRepository<Planet>,
    @InjectRepository(Species)
    private readonly speciesRepository: BaseRepository<Species>,
    @InjectRepository(Starship)
    private readonly starshipRepository: BaseRepository<Starship>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: BaseRepository<Vehicle>,
  ) {
    this.repositories = [
      this.filmRepository,
      this.characterRepository,
      this.planetRepository,
      this.speciesRepository,
      this.starshipRepository,
      this.vehicleRepository,
    ];
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteOldRecords() {
    const currentDate = new Date();
    const date24HoursAgo = new Date(
      currentDate.setHours(currentDate.getHours() - 24),
    );

    try {
      await Promise.all(
        this.repositories.map((repo) =>
          repo.delete({ createdAt: LessThan(date24HoursAgo) }),
        ),
      );
      this.logger.log("Successfully deleted old cache records.");
    } catch (error) {
      this.logger.error(`Failed to delete old cache records: ${error.message}`);
    }
  }
}
