import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { Cart, productInCart } from "../models/cart.model";
import {
  addToCardValidation,
  updateCartValidation,
} from "../validations/cart.validation";

const createCart = async (userId: any, product: any) => {
  return await Cart.create({
    cart_user: userId,
    cart_products: [product],
    cart_products_count: 1,
  });
};

const updateCartQuantity = async (userId: any, product: any) => {
  const query = {
    cart_user: userId,
    "cart_products.product_id": product.product_id,
  };
  const update = {
    $inc: {
      "cart_products.$.product_quantity": product.product_quantity,
    },
  };
  const options = { new: true };
  return await Cart.findOneAndUpdate(query, update, options);
};
const updateCartNewProduct = async (userId: any, product: any) => {
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
  return await Cart.findOneAndUpdate(query, update, options);
};
const addProductToCartService = async (userId: any, product: any) => {
  const { error } = await addToCardValidation(product as productInCart);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  product = { ...product, product_quantity: +product.product_quantity };
  //check xem co trong cart chua
  const userCart = await Cart.findOne({ cart_user: userId });
  if (!userCart) {
    const newCart = await createCart(userId, product);
    if (!newCart) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Cannot add product to cart"
      );
    }
    return newCart;
  }
  //Da co cart nhung chua co san pham trong cart
  if (userCart.cart_products_count === 0) {
    userCart.cart_products = [product];
    await userCart.save();
    return userCart;
  }
  const productIndex = userCart.cart_products.findIndex(
    (p) => p.product_id === product.product_id
  );
  if (productIndex !== -1) {
    const updateCart = await updateCartQuantity(userId, product);
    if (!updateCart) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Cannot add product to cart"
      );
    }
    return updateCart;
  } else {
    const updateCart = await updateCartNewProduct(userId, product);
    if (!updateCart) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Cannot add product to cart"
      );
    }
    return updateCart;
  }
};

const updateCartService = async (userId: any, product: any) => {
  const { error } = await updateCartValidation(product);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const userCart = await Cart.findOne({ cart_user: userId });
  if (!userCart) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Cart not found");
  }
  if (
    !userCart.cart_products.find(
      (p: any) => p.product_id === product.product_id
    )
  ) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Product not found in cart"
    );
  }
  const updateCart = await updateCartQuantity(userId, {
    product_id: product.product_id,
    product_quantity: product.product_quantity - product.product_old_quantity,
  });
  if (!updateCart) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Cannot update cart");
  }
  return updateCart;
};
export { addProductToCartService, updateCartService };
