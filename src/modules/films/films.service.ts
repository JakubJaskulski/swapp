import { Inject, Injectable } from "@nestjs/common";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw } from "typeorm";
import { Film } from "./film.entity";
import { BaseRepository } from "../../repositories/swapp-repository";
import { CharactersService } from "../characters/characters.service";

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    @Inject("FilmRepository")
    private readonly filmsRepository: BaseRepository<Film>,
    private readonly swapiService: SwapiService,
    private readonly charactersService: CharactersService,
  ) {}

  async findAll(search?: string, page?: number): Promise<Film[]> {
    const cachedFilms = await this.filmsRepository.find({
      where: {
        search: Raw((alias) => `:tag = ANY(${alias})`, { tag: search }),
        page,
      },
    });

    if (cachedFilms && cachedFilms.length > 0) {
      return cachedFilms;
    }

    const swapiFilms = await this.swapiService.getSwapiFilms(search, page);

    swapiFilms.forEach((swapiFilm) => {
      this.filmsRepository.upsertWithArrayMerge(swapiFilm, "url", ["search"]);
    });

    return swapiFilms.map((swapiFilm) => {
      delete swapiFilm["search"];
      delete swapiFilm["page"];
      return swapiFilm;
    });
  }

  async findOne(id): Promise<Film> {
    return await this.swapiService.getSwapiFilm(id);
  }

  async getUniqueWordsFromOpeningCrawls(): Promise<OccurrencesArray> {
    const films = await this.findAll();
    const combinedCrawlText = films
      .reduce((combined, movie) => combined + movie.opening_crawl + " ", "")
      .trim();
    return this.getUniqueWords(combinedCrawlText);
  }

  private getUniqueWords(text: string): OccurrencesArray {
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
    const films = await this.findAll();
    const combinedCrawlText = films
      .reduce((combined, movie) => combined + movie.opening_crawl + " ", "")
      .trim();

    const characters = await this.charactersService.findAll();
    const characterNames = characters.map((character) => character.name);

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
