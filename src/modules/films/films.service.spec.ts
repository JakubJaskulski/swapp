import { Test, TestingModule } from "@nestjs/testing";
import { FilmsService } from "./films.service";
import { SwapiService } from "../../shared/swapi/swapi.service";
import { CharactersService } from "../characters/characters.service";
import { BaseRepository } from "../../repositories/swapp-repository";
import { Film } from "./film.entity";

describe("FilmsService", () => {
  let service: FilmsService;
  let _swapiService: SwapiService;
  let _charactersService: CharactersService;
  let _filmsRepository: BaseRepository<Film>;

  const mockFilms: Film[] = [
    {
      title: "Film 1",
      opening_crawl: "It is a period of civil war. Luke Skywalker.",
      url: "url_1",
    } as Film,
    {
      title: "Film 2",
      opening_crawl: "The battle continues.",
      url: "url_2",
    } as Film,
  ];

  const mockCharacters = [
    { name: "Luke Skywalker" },
    { name: "Darth Vader" },
    { name: "Leia Organa" },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: SwapiService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(mockFilms),
            getById: jest.fn().mockResolvedValue(mockFilms[0]),
          },
        },
        {
          provide: CharactersService,
          useValue: {
            getCharacters: jest.fn().mockResolvedValue(mockCharacters),
          },
        },
        {
          provide: "FilmRepository",
          useValue: {
            find: jest.fn().mockResolvedValue(mockFilms),
            upsertWithArrayMerge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    _swapiService = module.get<SwapiService>(SwapiService);
    _charactersService = module.get<CharactersService>(CharactersService);
    _filmsRepository = module.get<BaseRepository<Film>>("FilmRepository");
  });

  describe("getUniqueWordsFromOpeningCrawls", () => {
    it("should return unique words with their occurrences from opening crawls", async () => {
      const uniqueWords = await service.getUniqueWordsFromOpeningCrawls();
      expect(uniqueWords).toStrictEqual([
        { it: 1 },
        { is: 1 },
        { a: 1 },
        { period: 1 },
        { of: 1 },
        { civil: 1 },
        { war: 1 },
        { luke: 1 },
        { skywalker: 1 },
        { the: 1 },
        { battle: 1 },
        { continues: 1 },
      ]);
    });
  });

  describe("getCharacterNameWithMostOccurrencesInOpeningCrawls", () => {
    it("should return character(s) with most occurrences in opening crawls", async () => {
      const character =
        await service.getCharacterNameWithMostOccurrencesInOpeningCrawls();
      expect(character).toEqual("Luke Skywalker");
    });
  });

  describe("getUniqueWords", () => {
    it("should return a map of unique word occurrences from a given text", () => {
      const text = "It is a test. It is a simple test.";
      const uniqueWords = service["getUniqueWords"](text);

      expect(uniqueWords).toEqual([
        { it: 2 },
        { is: 2 },
        { a: 2 },
        { test: 2 },
        { simple: 1 },
      ]);
    });
  });
});
