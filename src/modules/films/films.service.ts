import { Inject, Injectable, Logger } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Film } from "./film.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { CharactersService } from "../characters/characters.service";
import { GenericEntityService } from "../generic-entity.service";

@Injectable()
export class FilmsService extends GenericEntityService<Film> {
  constructor(
    @InjectRepository(Film)
    @Inject("FilmRepository")
    private readonly filmsRepository: BaseRepository<Film>,
    swapiService: SwapiService,
    private readonly charactersService: CharactersService,
  ) {
    super(filmsRepository, swapiService);
  }

  async getFilms(search?: string, page?: number): Promise<Film[]> {
    return this.findAll(Film.swapiName, search, page);
  }

  async getFilmById(id: number): Promise<Film> {
    return this.findOne(Film.swapiName, id);
  }

  async getUniqueWordsWithCountFromOpeningCrawls(): Promise<OccurrencesArray> {
    const films = await this.getFilms();

    try {
      const combinedCrawlText = films
        .reduce((combined, movie) => combined + movie.opening_crawl + " ", "")
        .trim();
      return this.getUniqueWordsWithCount(combinedCrawlText);
    } catch (error) {
      this.logger.error(
        `Error in getUniqueWordsFromOpeningCrawls: : ${error.message}`,
      );
      throw new Error("Failed to get unique words from opening crawls");
    }
  }

  private getUniqueWordsWithCount(text: string): OccurrencesArray {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];

    const wordMap = new Map<string, number>();

    words.forEach((word) => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });

    return Array.from(wordMap.entries()).map(([word, count]) => ({
      [word]: count,
    }));
  }

  async getCharacterNameWithMostOccurrencesInOpeningCrawls(): Promise<
    string | string[]
  > {
    const films = await this.getFilms();
    const combinedCrawlText = films
      .reduce((combined, movie) => combined + movie.opening_crawl + " ", "")
      .trim();

    const characters = await this.charactersService.getCharacters();
    const characterNames = characters.map((character) => character.name);

    try {
      const occurrences = this.countOccurrences(
        combinedCrawlText,
        characterNames,
      );

      const maxOccurrences = Math.max(
        ...occurrences.flatMap((occurrence) => Object.values(occurrence)),
      );

      const maxOccurrencesName = occurrences
        .filter((obj) => Object.values(obj).includes(maxOccurrences))
        .map((occurrence) => Object.keys(occurrence)[0]);

      return maxOccurrencesName.length === 1
        ? maxOccurrencesName[0]
        : maxOccurrencesName;
    } catch (error) {
      this.logger.error(
        `Error in getCharacterNameWithMostOccurrencesInOpeningCrawls: ${error.message}`,
        error.message,
      );
      throw new Error(
        "Failed to get name of a character with most occurrences in opening crawls",
      );
    }
  }

  private countOccurrences(text: string, words: string[]): OccurrencesArray {
    return words.map((phrase) => {
      const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedPhrase}\\b`, "gi");

      const matches = text.match(regex);
      return { [phrase]: matches ? matches.length : 0 };
    });
  }
}

type OccurrencesArray = { [p: string]: number }[];
