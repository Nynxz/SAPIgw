import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as schema from "./schema/schema";
import { eq } from "drizzle-orm";
import { getRandomApiKey } from "./lib/lib";

class DBClient {
  db: PostgresJsDatabase<typeof schema>;
  queryClient: Sql<{}>;

  constructor(dbUrl: string) {
    this.queryClient = postgres(dbUrl);
    this.db = drizzle(this.queryClient, { schema });
  }

  doesUserExist = async (username: string) => {
    return Boolean(await this.getUserByUsername(username));
  };
  getUserByUsername = async (username: string) => {
    try {
      const user = this.db.query.user.findFirst({
        where: eq(schema.user.username, username),
      });
      return user;
    } catch (error) {
      return null;
    }
  };

  getUserById = async (id: number) => {
    const user = await this.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });
    return user;
  };

  createUser = async (user: schema.NewUser) => {
    try {
      const newU = await this.db
        .insert(schema.user)
        .values(user)
        .returning()
        .then((a) => (a[0] ? a[0] : null));
      console.log(`DB: Created user ${newU?.username}`);
      return newU;
    } catch (error) {
      console.log(`Failed to create user`);
      return null;
    }
  };

  createAPIKeyForID = async (id: number) => {
    const _tempKey = getRandomApiKey();
    let apiKey = await this.db
      .insert(schema.apikey)
      .values({
        key: _tempKey,
        user: id,
      })
      .returning()
      .then((a) => (a[0] ? a[0] : null));
    console.log(`DB: Created API Key ${apiKey?.user} : ${apiKey?.key}`);
    return apiKey;
  };

  checkAPIKey = async (key: string | undefined) => {
    if (!key) {
      console.log("NO KEY PROVIDED");
      return null;
    }
    const apiKey = await this.db.query.apikey.findFirst({
      where: eq(schema.apikey.key, key),
    });
    return apiKey;
  };

  getUserOfAPIKey = async (
    key: schema.ApiKey
  ): Promise<schema.User | undefined> => {
    if (!key) {
      return undefined;
    }
    const user = await this.getUserById(key.user as number);
    return user;
  };
  getAPIKeysOfUserByID = async (userId: number) => {
    const apiKeys = await this.db.query.apikey.findMany({
      where: eq(schema.apikey.user, userId),
    });
    return apiKeys;
  };
  // All requests use this
}

export { DBClient };
