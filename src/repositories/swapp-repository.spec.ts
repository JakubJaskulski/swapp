import { BaseRepository } from "./swapp-repository";
import { DataSource } from "typeorm";

describe("BaseRepository", () => {
  class MockEntity {
    url: string;
    page: number;
    search: string[];
  }

  const tableName = "mock_table";

  describe("upsertWithArrayMerge", () => {
    let baseRepository: BaseRepository<MockEntity>;
    let dataSource: DataSource;

    beforeEach(() => {
      dataSource = { createEntityManager: () => {} } as DataSource;

      baseRepository = new BaseRepository<MockEntity>(
        MockEntity as any,
        dataSource as DataSource,
      );
      baseRepository.query = jest.fn(); // Mock the query method

      Object.defineProperty(baseRepository, "metadata", {
        value: {
          tableName,
        },
      });
    });

    it("should construct the correct query with array fields", async () => {
      const entity = { page: 1, url: "Test", search: ["tag1", "tag2"] };
      const conflictField = "page";
      const arrayFields = ["search"] as (keyof MockEntity)[];

      const expectedQuery = `
      INSERT INTO ${tableName} (page, url, search)
      VALUES ($1, $2, $3)
      ON CONFLICT (page)
      DO UPDATE SET page = EXCLUDED.page, url = EXCLUDED.url, search = ARRAY(SELECT DISTINCT UNNEST(${tableName}.search || EXCLUDED.search))
    `;
      const expectedValues = [1, "Test", ["tag1", "tag2"]];

      await baseRepository.upsertWithArrayMerge(
        entity,
        conflictField,
        arrayFields,
      );

      expect(baseRepository.query).toHaveBeenCalledWith(
        expectedQuery,
        expectedValues,
      );
    });

    it("should construct the correct query without array fields", async () => {
      const entity = { page: 2, url: "Another Test" };
      const conflictField = "page";
      const arrayFields = []; // No array fields

      const expectedQuery = `
      INSERT INTO ${tableName} (page, url)
      VALUES ($1, $2)
      ON CONFLICT (page)
      DO UPDATE SET page = EXCLUDED.page, url = EXCLUDED.url
    `;
      const expectedValues = [2, "Another Test"];

      await baseRepository.upsertWithArrayMerge(
        entity,
        conflictField,
        arrayFields,
      );

      expect(baseRepository.query).toHaveBeenCalledWith(
        expectedQuery,
        expectedValues,
      );
    });
  });
});
