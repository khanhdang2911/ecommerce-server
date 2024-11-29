import { IInventory, Inventory } from "../models/inventory";

const findOneInventory = async (productId: string) => {
  return await Inventory.findOne({ inven_product_id: productId });
};

const inventoryInsert = async (inventory: IInventory) => {
  await Inventory.create(inventory);
};

const updateStock = async (productId: string, quantity: number) => {
  const query = {
    inven_product_id: productId,
  };
  const update = {
    $set: {
      inven_stock: quantity,
    },
  };
  const options = {
    new: true,
  };
  return await Inventory.findOneAndUpdate(query, update, options);
};
const decreaseStock = async (productId: string, quantity: number) => {
  const inventory = await findOneInventory(productId);
  if (!inventory || inventory.inven_stock < quantity) {
    return null;
  }
  const query = {
    inven_product_id: productId,
  };
  const update = {
    $inc: {
      inven_stock: -quantity,
    },
  };
  const options = {
    new: true,
  };
  return await Inventory.findOneAndUpdate(query, update, options);
};

const increaseStock = async (productId: string, quantity: number) => {
  const query = {
    inven_product_id: productId,
  };
  const update = {
    $inc: {
      inven_stock: quantity,
    },
  };
  const options = {
    new: true,
  };
  return Inventory.findOneAndUpdate(query, update, options);
};

export { inventoryInsert, decreaseStock, updateStock, increaseStock };
