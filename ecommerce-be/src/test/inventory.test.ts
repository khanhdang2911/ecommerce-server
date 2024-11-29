import { subscriber } from "../services/redisPubSub.service";

const updateInventory = async () => {
  await subscriber("purchaseProduct", (message: string) => {
    const { productId, productQuantity } = JSON.parse(message);
    console.log(
      `Product ${productId} is purchased with quantity ${productQuantity}`
    );
  });
};

export { updateInventory };
