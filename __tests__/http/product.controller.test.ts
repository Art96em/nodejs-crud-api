import request from "supertest";

import { app } from "../../src/app";
import * as productService from "../../src/services/productService";
import { CreateProductType } from "../../src/validation/productSchema";
import { ProductType } from "../../src/types/prisma/ProductTypes";
import { Decimal } from "@prisma/client/runtime/client";
import { ProductNotFoundError } from "../../src/errors/ProductErrors";
import { CartItemNotFoundError } from "../../src/errors/CartErrors";

jest.mock("../../src/services/productService");

let mockUser: any = null;

jest.mock("../../src/middlewares/auth", () => ({
  auth: (req: any, _res: any, next: any) => {
    if (mockUser) {
      req.user = mockUser;
    }
    next();
  },
}));

const id = "ea5e0e84-839f-4d17-953d-3cdea5b68d23";
const name = "Product 111";
const description = "Product 1 full description";
const price = 199.99;
const quantity = 10;

const productToCreate: CreateProductType = {
  name,
  description,
  price,
  quantity,
};

const createdProduct: ProductType = {
  name,
  description,
  price: new Decimal(price),
  quantity,
  id,
  created_at: new Date(),
  updated_at: new Date(),
  image_url: null,
};

const returnCreatedProduct = {
  ...createdProduct,
  price: createdProduct.price.toString(),
  created_at: createdProduct.created_at?.toISOString(),
  updated_at: createdProduct.updated_at?.toISOString(),
};

describe("POST /products", () => {
  afterEach(() => {
    mockUser = null;
  });

  it("201 - admin", async () => {
    mockUser = { id: 1, role: "admin" };

    (productService.createProduct as jest.Mock).mockResolvedValue(
      createdProduct
    );

    const res = await request(app).post("/products").send(productToCreate);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(returnCreatedProduct);
  });

  it("403 — user", async () => {
    mockUser = { id: 1, role: "user" };

    const res = await request(app).post("/products").send(productToCreate);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });
});

describe("PUT /products", () => {
  it("200", async () => {
    mockUser = { id: 1, role: "admin" };

    (productService.updateProduct as jest.Mock).mockResolvedValue(
      returnCreatedProduct
    );

    const res = await request(app).put(`/products/${id}`).send({ quantity });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(returnCreatedProduct);
  });

  it("403 - user", async () => {
    mockUser = { id: 1, role: "user" };

    const res = await request(app).put(`/products/${id}`).send({ quantity });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("400 - VALIDATION_ERROR", async () => {
    mockUser = { id: 1, role: "admin" };

    const res = await request(app).put(`/products/${id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("400 - VALIDATION_ERROR", async () => {
    mockUser = { id: 1, role: "admin" };

    const res = await request(app).put(`/products/1`).send({ quantity });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields.id).toBe("Invalid format");
  });
});

describe("DELETE /products", () => {
  it("200 - admin", async () => {
    mockUser = { id: 1, role: "admin" };

    (productService.deleteProduct as jest.Mock).mockResolvedValue({}); // TODO

    const res = await request(app).delete(`/products/${id}`).send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  it("403 - user", async () => {
    mockUser = { id: 1, role: "user" };

    const res = await request(app).delete(`/products/${id}`).send();

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("400 - VALIDATION_ERROR", async () => {
    mockUser = { id: 1, role: "admin" };

    const res = await request(app).delete(`/products/1`).send();

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields.id).toBe("Invalid format");
  });

  it("404", async () => {
    mockUser = { id: 1, role: "admin" };

    (productService.deleteProduct as jest.Mock).mockRejectedValue(
      new CartItemNotFoundError(id)
    );

    const res = await request(app).delete(`/products/${id}`).send();

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("CART_ITEM_NOT_FOUND");
  });
});

describe("GET /products", () => {
  it("200 - admin", async () => {
    (productService.getProducts as jest.Mock).mockResolvedValue([
      returnCreatedProduct,
    ]);

    const res = await request(app).get(`/products`).send();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe("GET /products", () => {
  it("200 - admin", async () => {
    (productService.getProducts as jest.Mock).mockResolvedValue([
      returnCreatedProduct,
    ]);

    const res = await request(app).get(`/products`).send();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe("GET /product", () => {
  it("200 - admin", async () => {
    (productService.getProduct as jest.Mock).mockResolvedValue(createdProduct);

    const res = await request(app).get(`/products/${id}`).send();

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(returnCreatedProduct);
  });

  it("400 - VALIDATION_ERROR", async () => {
    const res = await request(app).get(`/products/1`).send();

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields.id).toBe("Invalid format");
  });
});
