import { Test, TestingModule } from "@nestjs/testing";
import { GenericEntityService } from "./generic-entity.service";
import { SwapiService } from "../shared/swapi/swapi.service";
import { BaseRepository } from "../repositories/swapp-repository";
import { SwapiResource } from "../shared/swapi/swapi.service";
import { HttpException, HttpStatus } from "@nestjs/common";

class MockRepository<_T> {
  find = jest.fn();
  upsertWithArrayMerge = jest.fn();
}

class MockSwapiService {
  getAll = jest.fn();
  getById = jest.fn();
}

class TestEntity implements SwapiResource {
  static swapiName = "Test Entity";
  page: number;
  search: string[] | undefined;
  url: string;
}

describe("GenericEntityService", () => {
  let service: GenericEntityService<TestEntity>;
  let repository: MockRepository<TestEntity>;
  let swapiService: MockSwapiService;

  beforeEach(async () => {
    repository = new MockRepository<TestEntity>();
    swapiService = new MockSwapiService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseRepository,
          useValue: repository,
        },
        {
          provide: SwapiService,
          useValue: swapiService,
        },
        {
          provide: GenericEntityService,
          useFactory: () =>
            new (class extends GenericEntityService<TestEntity> {
              constructor() {
                super(repository as any, swapiService as any);
              }
            })(),
        },
      ],
    }).compile();

    service =
      module.get<GenericEntityService<TestEntity>>(GenericEntityService);
  });

  describe("findAll", () => {
    it("should return cached entities if found", async () => {
      const cachedEntities: TestEntity[] = [
        {
          url: "url1",
          search: [],
          page: 1,
        },
      ];
      repository.find.mockResolvedValue(cachedEntities);

      const result = await service.findAll("testEntity");
      expect(result).toEqual(cachedEntities);
    });

    it("should fetch from SwapiService if no cached entities are found", async () => {
      repository.find.mockResolvedValue([]);
      const swapiEntities: TestEntity[] = [
        {
          url: "url2",
          search: [],
          page: 2,
        },
      ];
      swapiService.getAll.mockResolvedValue(swapiEntities);

      const result = await service.findAll("testEntity");
      expect(result).toEqual(swapiEntities);
    });

    it("should handle errors and throw HttpException", async () => {
      repository.find.mockRejectedValue(new Error("Database error"));

      await expect(service.findAll("Planet")).rejects.toThrow(
        new HttpException(
          "Failed to fetch entities of type Planet",
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe("findOne", () => {
    it("should fetch an entity by ID using SwapiService", async () => {
      const entity: TestEntity = {
        url: "url1",
        search: [],
        page: 1,
      };
      swapiService.getById.mockResolvedValue(entity);

      const result = await service.findOne<TestEntity>("testEntity", 1);
      expect(result).toEqual(entity);
    });

    it("should throw a 404 error if entity is not found", async () => {
      swapiService.getById.mockResolvedValue(null);

      await expect(service.findOne("Planet", 1)).rejects.toThrow(
        new HttpException(
          "Entity of type Planet with ID 1 not found.",
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it("should handle errors and throw HttpException", async () => {
      swapiService.getById.mockRejectedValue(new Error("API error"));

      await expect(service.findOne("Planet", 1)).rejects.toThrow(
        new HttpException(
          "Failed to fetch entity of type Planet with ID 1",
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
