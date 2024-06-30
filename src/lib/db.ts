import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../schema/schema";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { getRandomApiKey } from "./lib";
dotenv.config();

const db = drizzle(postgres(process.env.DATABASE_URL as string), { schema });

const doesUserExist = async (username: string) => {
  return Boolean(await getUserByUsername(username));
};

const getUserByUsername = async (username: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.username, username),
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserById = async (id: number) => {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, id),
  });
  return user;
};

const createUser = async (user: schema.NewUser) => {
  try {
    const newUser = await db
      .insert(schema.user)
      .values(user)
      .returning()
      .then((array) => (array[0] ? array[0] : null));
    console.log(`DB: Created user ${newUser?.username}`);
    return newUser;
  } catch (error) {
    console.log("Failed to create user... is postgres down?");
    return null;
  }
};

const createAPIKeyForID = async (id: number) => {
  const _tempKey = getRandomApiKey();
  let apiKey = await db
    .insert(schema.apikey)
    .values({
      key: _tempKey,
      user: id,
    })
    .returning()
    .then((array) => (array[0] ? array[0] : null));
  console.log(`DB: Created API Key ${apiKey?.user} : ${apiKey?.key}`);
  return apiKey;
};

const checkAPIKey = async (key: string | undefined) => {
  if (!key) {
    console.log("NO KEY PROVIDED");
    return null;
  }
  const apiKey = await db.query.apikey.findFirst({
    where: eq(schema.apikey.key, key),
  });
  return apiKey;
};

const getUserOfAPIKey = async (
  key: schema.ApiKey
): Promise<schema.User | undefined> => {
  if (!key) {
    return undefined;
  }
  const user = await getUserById(key.user as number);
  return user;
};

const getApiKeysOfUserById = async (userId: number) => {
  const apiKeys = await db.query.apikey.findMany({
    where: eq(schema.apikey.id, userId),
  });
  return apiKeys;
};

export {
  doesUserExist,
  getUserByUsername,
  getUserById,
  createUser,
  createAPIKeyForID,
  checkAPIKey,
  getUserOfAPIKey,
  getApiKeysOfUserById,
};
