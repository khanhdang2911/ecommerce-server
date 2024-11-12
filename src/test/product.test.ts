import { publisher } from "../services/redisPubSub.service";

const purchaseProduct = async (productId: string, productQuantity: number) => {
  await publisher(
    "purchaseProduct",
    JSON.stringify({ productId, productQuantity })
  );
  console.log("Product is purchased");
};

export { purchaseProduct };
