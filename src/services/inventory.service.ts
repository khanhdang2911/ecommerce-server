import { IInventory, Inventory } from "../models/inventory";

const inventoryInsert = async (inventory: IInventory) => {
  await Inventory.create(inventory);
};

export { inventoryInsert };
