import * as S from "@effect/schema/Schema";

import { Database, indexes, NonEmptyString50 } from "./schema";

import {
  NonEmptyString1000,
  NotNull,
  cast,
  createEvolu,
  jsonArrayFrom,
} from "@/lib/evolu/evolu";

export * from "./schema";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDatabase = () =>
  createEvolu(Database, {
    indexes,
    ...(true && {
      syncUrl: "http://localhost:4000",
      enableWebsocketConnection: true,
    }),
    initialData: (evolu) => {
      const { id: categoryId, ...rest } = evolu.create("todoCategory", {
        name: S.decodeSync(NonEmptyString50)("Not Urgent"),
      });
      console.log("categoryId", categoryId, rest);
      evolu.create("todo", {
        title: S.decodeSync(NonEmptyString1000)("Try React Suspense"),
        categoryId,
      });
    },
    // minimumLogLevel: "debug",
  });

export const evolu = createDatabase();

export const todoCategories = evolu.createQuery((db) =>
  db
    .selectFrom("todoCategory")
    .select(["id", "name", "json"])
    .where("isDeleted", "is not", cast(true))
    // Filter null value and ensure non-null type.
    .where("name", "is not", null)
    .$narrowType<{ name: NotNull }>()
    .orderBy("createdAt")
);

// Evolu queries should be collocated. If necessary, they can be preloaded.
export const todosWithCategories = evolu.createQuery(
  (db) =>
    db
      .selectFrom("todo")
      .select(["id", "title", "isCompleted", "categoryId"])
      .where("isDeleted", "is not", cast(true))
      // Filter null value and ensure non-null type.
      .where("title", "is not", null)
      .$narrowType<{ title: NotNull }>()
      .orderBy("createdAt")
      // https://kysely.dev/docs/recipes/relations
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("todoCategory")
            .select(["todoCategory.id", "todoCategory.name"])
            .where("isDeleted", "is not", cast(true))
            .orderBy("createdAt")
        ).as("categories"),
      ]),
  {
    logQueryExecutionTime: true,
    logExplainQueryPlan: true,
  }
);
