import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import {
  REDIS_CONNECT_STATUS,
  REDIS_CONNTECTION_TIMEOUT,
} from "../constants/redis.constant";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";
dotenv.config();

//=============================Cach 1=========================

// const client = await createClient({
//   url: `redis://${process.env.REDIS_URL}`,
//   password: process.env.REDIS_PASSWORD,
// });
// client.on("error", (err) => {
//   console.log("Error when connect to redis:", err);
// });
// client.on("connect", () => {
//   console.log("Connected to redis");
// });
// client.on("end", () => {
//   console.log("Disconnected from redis");
// });
// client.on("reconnecting", () => {
//   console.log("Reconnecting to redis");
// });
// client.on("ready", () => {
//   console.log("Redis is ready");
// });

// const redisClient = await client.connect();
// export default redisClient;

// =============================Cach 2=========================

let connectionTimeout: any;
const handleErrorTimeout = () => {
  connectionTimeout = setTimeout(() => {
    throw new ErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Can not connect to redis"
    );
  }, REDIS_CONNTECTION_TIMEOUT);
};

const handleEventConnection = (connectionRedis: any) => {
  connectionRedis.on(REDIS_CONNECT_STATUS.ERROR, (err: any) => {
    console.log("Error when connect to redis:", err);
    handleErrorTimeout();
  });
  connectionRedis.on(REDIS_CONNECT_STATUS.CONNECT, () => {
    console.log("Connected to redis");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(REDIS_CONNECT_STATUS.END, () => {
    console.log("Disconnected from redis");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(REDIS_CONNECT_STATUS.RECONNECTING, () => {
    console.log("Reconnecting to redis");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(REDIS_CONNECT_STATUS.READY, () => {
    console.log("Redis is ready");
    clearTimeout(connectionTimeout);
  });
};

const initRedis = async () => {
  try {
    const redisClient = await createClient({
      url: `redis://${process.env.REDIS_URL}`,
      password: process.env.REDIS_PASSWORD,
    });
    handleEventConnection(redisClient);

    return await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw new ErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Redis connection failed"
    );
  }
};

export { initRedis };
