import { Repository, EntityTarget, DataSource } from "typeorm";
import { SwapiResource } from "../shared/swapi/swapi.service";

export class BaseRepository<T extends SwapiResource> extends Repository<T> {
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async upsertWithArrayMerge(
    entity: Partial<T>,
    conflictField: keyof T,
    arrayFields: (keyof T)[],
  ): Promise<void> {
    const keys = Object.keys(entity) as (keyof T)[];
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const values = keys.map((key) => entity[key]);

    const updateSet = keys
      .map((key) =>
        arrayFields.includes(key)
          ? `${String(key)} = ARRAY(SELECT DISTINCT UNNEST(${this.metadata.tableName}.${String(key)} || EXCLUDED.${String(key)}))`
          : `${String(key)} = EXCLUDED.${String(key)}`,
      )
      .join(", ");

    const query = `
      INSERT INTO ${this.metadata.tableName} (${keys.join(", ")})
      VALUES (${placeholders.join(", ")})
      ON CONFLICT (${String(conflictField)})
      DO UPDATE SET ${updateSet}
    `;

    await this.query(query, values);
  }
}
