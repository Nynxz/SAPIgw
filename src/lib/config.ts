import * as dotenv from "dotenv";
dotenv.config();

type Config = {
  PORT: string;
  DATABASE_URL: string;
  INFLUXDB_TOKEN: string;
  LOGGING: boolean;
};

const CreateConfig = (): Config => {
  const config = {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    INFLUXDB_TOKEN: process.env.INFLUXDB_TOKEN as string,
    LOGGING: Boolean(
      (process.env.LOGGING as string).toLowerCase() == "true" ? true : false
    ),
  };
  if (config.LOGGING)
    console.log(
      `[server]: Created Simple API Gateway ${
        "" && `\n${JSON.stringify(config)}`
      }`
    );

  return config;
};

export { CreateConfig, Config };
