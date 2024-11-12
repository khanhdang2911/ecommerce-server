import { createClient } from "redis";
import dotenv from "dotenv";
import { initRedis } from "../dbs/init.redis";
dotenv.config();
const publisher = async (channel: string, message: string) => {
  const client = await initRedis();
  await client.publish(channel, message);
};

const subscriber = async (
  channel: string,
  callback: (message: string) => void
) => {
  const client = await initRedis();

  await client.subscribe(channel, callback);
};

export { publisher, subscriber };
