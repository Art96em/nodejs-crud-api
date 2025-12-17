import { CartItemNotFoundError } from "../../src/errors/CartErrors";
import {
  NotEnoughStockError,
  ProductNotFoundError,
} from "../../src/errors/ProductErrors";
import { CartRepository } from "../../src/repositories/cartRepository";
import { ProductRepository } from "../../src/repositories/productRepository";
import {
  updateCartItem,
  addItem,
  deleteCartItem,
} from "../../src/services/cartService";

jest.mock("../../src/repositories/cartRepository");
jest.mock("../../src/repositories/productRepository");

const productId = "ea5e0e84-839f-4d17-953d-3cdea5b68d23";
const cartItemId = "8238469b-7b0f-46d1-bcff-af94411161d0";

describe("addItem — service", () => {
  it("throws ProductNotFoundError when product not found", async () => {
    (ProductRepository.getProductById as jest.Mock).mockResolvedValue(null);

    await expect(addItem(1, { productId, quantity: 5 })).rejects.toBeInstanceOf(
      ProductNotFoundError
    );
  });

  it("throws NotEnoughStockError when product stock is insufficient", async () => {
    (ProductRepository.getProductById as jest.Mock).mockResolvedValue({
      id: productId,
      quantity: 1,
    });

    await expect(addItem(1, { productId, quantity: 5 })).rejects.toBeInstanceOf(
      NotEnoughStockError
    );
  });

  it("updates quantity if item already exists in cart", async () => {
    (ProductRepository.getProductById as jest.Mock).mockResolvedValue({
      id: productId,
      quantity: 10,
    });

    (CartRepository.getItemByProductId as jest.Mock).mockResolvedValue({
      id: cartItemId,
      quantity: 3,
    });

    (CartRepository.changeQuantity as jest.Mock).mockResolvedValue({
      id: cartItemId,
      quantity: 5,
    });

    const result = await addItem(1, {
      productId,
      quantity: 2,
    });

    expect(CartRepository.changeQuantity).toHaveBeenCalledWith(
      1,
      cartItemId,
      5
    );
    expect(CartRepository.putItem).toHaveBeenCalledTimes(0);

    expect(result.quantity).toBe(5);
  });

  it("creates new cart item if item does not exist", async () => {
    (ProductRepository.getProductById as jest.Mock).mockResolvedValue({
      id: productId,
      quantity: 10,
    });

    (CartRepository.getItemByProductId as jest.Mock).mockResolvedValue(null);

    (CartRepository.putItem as jest.Mock).mockResolvedValue({
      id: productId,
      quantity: 2,
    });

    const result = await addItem(1, {
      productId,
      quantity: 2,
    });

    expect(CartRepository.putItem).toHaveBeenCalledWith(1, productId, 2);
    expect(CartRepository.changeQuantity).toHaveBeenCalledTimes(0);

    expect(result.quantity).toBe(2);
  });
});

describe("deleteCartItem - service", () => {
  it("CartItemNotFoundError", async () => {
    (CartRepository.removeItem as jest.Mock).mockResolvedValue({ count: 0 });

    await expect(deleteCartItem(1, cartItemId)).rejects.toBeInstanceOf(
      CartItemNotFoundError
    );

    expect(CartRepository.removeItem).toHaveBeenCalledTimes(1);
  });

  it("Cart item removed", async () => {
    (CartRepository.getItemByItemId as jest.Mock).mockResolvedValue({
      id: cartItemId,
    });
    (CartRepository.removeItem as jest.Mock).mockResolvedValue({
      count: 1,
    });

    await expect(deleteCartItem(1, cartItemId)).resolves.toBeUndefined();
    expect(CartRepository.removeItem).toHaveBeenCalledTimes(1);
  });
});

describe("updateCartItem — service", () => {
  it("CartItemNotFoundError - cart item not found", async () => {
    (CartRepository.getItemByItemIdTx as jest.Mock).mockResolvedValue(null);

    await expect(
      updateCartItem(1, cartItemId, { quantity: 5 })
    ).rejects.toBeInstanceOf(CartItemNotFoundError);
  });

  it("ProductNotFoundError - product not found", async () => {
    (CartRepository.getItemByItemIdTx as jest.Mock).mockResolvedValue({
      id: cartItemId,
      product_id: productId,
    });

    (ProductRepository.getProductByIdTx as jest.Mock).mockResolvedValue(null);

    await expect(
      updateCartItem(1, cartItemId, { quantity: 5 })
    ).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it("throws NotEnoughStockError when product stock is insufficient", async () => {
    (CartRepository.getItemByItemIdTx as jest.Mock).mockResolvedValue({
      id: cartItemId,
      product_id: productId,
    });

    (ProductRepository.getProductByIdTx as jest.Mock).mockResolvedValue({
      id: productId,
      quantity: 1,
    });

    await expect(
      updateCartItem(1, cartItemId, { quantity: 5 })
    ).rejects.toBeInstanceOf(NotEnoughStockError);
  });
});
