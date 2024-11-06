import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { Cart, IProductInCart } from "../models/cart.model";
import {
  addToCardValidation,
  deleteProductInCartValidation,
  updateCartValidation,
} from "../validations/cart.validation";
import { CART_ERROR_MESSASE } from "../constants/cart.constant";
import * as cartRepo from "../repositories/cart.repo";
import { checkProductBelongToShop } from "../repositories/product.repo";
const findProductInCart = (cart: any, product_id: string) => {
  return cart.cart_products.findIndex(
    (p: any) => p.product_id.toString() === product_id
  );
};
const createCart = async (userId: string, product: IProductInCart) => {
  const newCart = await Cart.create({
    cart_user: userId,
    cart_products: [product],
    cart_products_count: 1,
  });
  if (!newCart) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.CANNOT_ADD_PRODUCT
    );
  }
  return newCart;
};

const updateCartQuantity = async (userId: string, product: IProductInCart) => {
  const query = {
    cart_user: userId,
    "cart_products.product_id": product.product_id,
    "cart_products.product_shop": product.product_shop,
  };
  const update = {
    $inc: {
      "cart_products.$.product_quantity": product.product_quantity,
    },
  };
  const options = { new: true };
  const updatedCart = await Cart.findOneAndUpdate(query, update, options);
  if (!updatedCart)
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.CANNOT_UPDATE_CART
    );
  return updatedCart;
};
const updateCartNewProduct = async (
  userId: string,
  product: IProductInCart
) => {
  const query = {
    cart_user: userId,
  };
  const update = {
    $addToSet: {
      cart_products: product,
    },
    $inc: {
      cart_products_count: 1,
    },
  };
  const options = { new: true };
  const updatedCart = await Cart.findOneAndUpdate(query, update, options);
  if (!updatedCart)
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.CANNOT_UPDATE_CART
    );
  return updatedCart;
};
const deleteProductInCartService = async (
  userId: string,
  product_id: string
) => {
  const { error } = await deleteProductInCartValidation({
    product_id,
  });
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const userCart = await cartRepo.findUserCart(userId);
  if (findProductInCart(userCart, product_id) === -1) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.PRODUCT_NOT_FOUND_IN_CART
    );
  }
  const query = {
    cart_user: userId,
  };
  const update = {
    $pull: {
      cart_products: {
        product_id: product_id,
      },
    },
  };
  const options = { new: true };
  const updatedCart = await Cart.findOneAndUpdate(query, update, options);
  if (!updatedCart) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.CANNOT_UPDATE_CART
    );
  }
  return updatedCart;
};
const addProductToCartService = async (
  userId: string,
  product: IProductInCart
) => {
  const { error } = await addToCardValidation(product);
  if (error) throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  //check product belong to shop or not
  const checkProductBelongToShopResult = await checkProductBelongToShop(
    product.product_id,
    product.product_shop
  );
  if (checkProductBelongToShopResult === false) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.PRODUCT_NOT_BELONG_TO_SHOP + "hh"
    );
  }
  product = { ...product, product_quantity: +product.product_quantity };
  //check xem co trong cart chua
  const userCart = await Cart.findOne({ cart_user: userId });
  if (!userCart) return await createCart(userId, product);
  //Da co cart nhung chua co san pham trong cart
  if (userCart.cart_products_count === 0) {
    userCart.cart_products = [product];
    await userCart.save();
    return userCart;
  }
  const updatedCart =
    findProductInCart(userCart, product.product_id) === -1
      ? await updateCartNewProduct(userId, product)
      : await updateCartQuantity(userId, product);

  return updatedCart;
};

const updateCartService = async (userId: string, product: IProductInCart) => {
  const { error } = await updateCartValidation(product);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }

  const userCart = await cartRepo.findUserCart(userId);
  if (findProductInCart(userCart, product.product_id) === -1) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.PRODUCT_NOT_FOUND_IN_CART
    );
  }
  const updatedProduct =
    +product.product_quantity === 0
      ? deleteProductInCartService(userId, product.product_id)
      : updateCartQuantity(userId, {
          product_shop: product.product_shop,
          product_id: product.product_id,
          product_quantity:
            product.product_quantity - product.product_old_quantity!,
        });
  return updatedProduct;
};

const getListProductInCartService = async (userId: string) => {
  const userCart = await Cart.findOne({ cart_user: userId })
    .populate(
      "cart_products.product_id",
      "product_name product_price product_thumb"
    )
    .lean()
    .exec();
  if (!userCart) {
    throw new ErrorResponse(
      StatusCodes.NOT_FOUND,
      CART_ERROR_MESSASE.CART_NOT_FOUND
    );
  }
  const results = userCart.cart_products.map((product: any) => {
    const productCustom = {
      ...product,
      ...product.product_id,
      product_id: product.product_id._id,
    };
    delete productCustom._id;
    return productCustom;
  });
  return {
    ...userCart,
    cart_products: results,
  };
};

export {
  addProductToCartService,
  updateCartService,
  deleteProductInCartService,
  getListProductInCartService,
};
