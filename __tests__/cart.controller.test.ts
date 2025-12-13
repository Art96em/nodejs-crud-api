import request from "supertest";

import { app } from "../src/app";
import * as cartService from "../src/services/cartService";
import { ProductNotFoundError } from "../src/errors/ProductErrors";
import { CartItemNotFoundError } from "../src/errors/CartErrors";

jest.mock("../src/services/cartService");

jest.mock("../src/middlewares/auth", () => ({
  auth: (_req: any, _res: any, next: any) => {
    _req.user = { id: 1, role: "user" };
    next();
  },
}));

const productId = "ea5e0e84-839f-4d17-953d-3cdea5b68d23";
const cartItemId = "8238469b-7b0f-46d1-bcff-af94411161d0";

describe("POST /cart", () => {
  it("Create cart item", async () => {
    (cartService.addItem as jest.Mock).mockResolvedValue({
      id: cartItemId,
      user_id: 1,
      product_id: productId,
      quantity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const res = await request(app)
      .post("/cart")
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      user_id: 1,
      product_id: productId,
      quantity: 2,
    });
  });

  it("400 if payload is invalid", async () => {
    const res = await request(app).post("/cart").send({ productId });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("400 if quantity is negative", async () => {
    const res = await request(app).post("/cart").send({
      productId,
      quantity: -2,
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields.quantity).toBe(
      "Quantity should be greater than 1"
    );
  });

  it("PRODUCT_NOT_FOUND error", async () => {
    (cartService.addItem as jest.Mock).mockRejectedValue(
      new ProductNotFoundError(productId)
    );

    const res = await request(app).post("/cart").send({
      productId,
      quantity: 2,
    });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("PRODUCT_NOT_FOUND");
  });
});

describe("GET /cart", () => {
  it("Success", async () => {
    (cartService.getCartItems as jest.Mock).mockResolvedValue([
      {
        id: cartItemId,
        user_id: 1,
        product_id: productId,
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: cartItemId,
        user_id: 1,
        product_id: productId,
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const res = await request(app).get("/cart").send();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});

describe("DELETE /cart", () => {
  it("Cleared", async () => {
    (cartService.clearCart as jest.Mock).mockResolvedValue({});

    const res = await request(app).delete("/cart").send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cart is cleared");
  });
});

describe("DELETE /cart", () => {
  it("Success", async () => {
    (cartService.deleteCartItem as jest.Mock).mockResolvedValue({});

    const res = await request(app).delete(`/cart/${cartItemId}`).send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item removed");
  });

  it("404 if item not found", async () => {
    (cartService.deleteCartItem as jest.Mock).mockRejectedValue(
      new CartItemNotFoundError(cartItemId)
    );

    const res = await request(app).delete(`/cart/${cartItemId}`).send();

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("CART_ITEM_NOT_FOUND");
  });
});
