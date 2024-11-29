import { initRedis } from "../dbs/init.redis";
import { promisify } from "util";
import { decreaseStock } from "./inventory.service";
const redisClient = await initRedis();
const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnx = promisify(redisClient.setNX).bind(redisClient);
const acquireLock = async (productId: string, quantity: number) => {
  const key = `lock2024:${productId}`;
  const retriesTime = 10;
  const exprireTime = 3000;
  for (let i = 1; i <= retriesTime; i++) {
    const result = await redisClient.setNX(key, quantity.toString());
    if (result === true) {
      const updateInventory = await decreaseStock(productId, quantity);
      if (updateInventory) {
        await redisClient.pExpire(key, exprireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (key: string) => {
  return await redisClient.del(key);
};

export { acquireLock, releaseLock };
