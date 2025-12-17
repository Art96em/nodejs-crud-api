import {
  Decimal,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/client";

import { ProductRepository } from "../../src/repositories/productRepository";
import { CreateProductType } from "../../src/validation/productSchema";
import { ProductType } from "../../src/types/prisma/ProductTypes";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../../src/services/productService";
import { ProductNotFoundError } from "../../src/errors/ProductErrors";

const id = "ea5e0e84-839f-4d17-953d-3cdea5b68d23";
const name = "product 1";
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

jest.mock("../../src/repositories/productRepository");

describe("create product - service", () => {
  it("success", async () => {
    (ProductRepository.createProduct as jest.Mock).mockResolvedValue(
      createdProduct
    );

    const result = await createProduct(productToCreate);

    expect(result).toMatchObject(createdProduct);
  });
});

describe("delete product - service", () => {
  it("success", async () => {
    (ProductRepository.deleteProduct as jest.Mock).mockResolvedValue({
      count: 1,
    });

    await expect(deleteProduct(id)).resolves.toBeUndefined();
    expect(ProductRepository.deleteProduct).toHaveBeenCalledTimes(1);
  });

  it("ProductNotFoundError", async () => {
    (ProductRepository.deleteProduct as jest.Mock).mockResolvedValue({
      count: 0,
    });

    await expect(deleteProduct(id)).rejects.toBeInstanceOf(
      ProductNotFoundError
    );
    expect(ProductRepository.deleteProduct).toHaveBeenCalledTimes(1);
  });
});

describe("update product - service", () => {
  it("success", async () => {
    (ProductRepository.updateProduct as jest.Mock).mockResolvedValue(
      createdProduct
    );

    const res = await updateProduct(id, productToCreate);

    expect(ProductRepository.updateProduct).toHaveBeenCalledTimes(1);
    expect(res).toMatchObject(createdProduct);
  });

  it("ProductNotFoundError", async () => {
    (ProductRepository.updateProduct as jest.Mock).mockRejectedValue({
      code: "P2025",
    });

    await expect(updateProduct(id, productToCreate)).rejects.toBeInstanceOf(
      ProductNotFoundError
    );

    expect(ProductRepository.updateProduct).toHaveBeenCalledTimes(1);
  });
});

describe("get products - service", () => {
  it("success", async () => {
    (ProductRepository.getAllProducts as jest.Mock).mockResolvedValue([
      createdProduct,
    ]);

    const res = await getProducts();

    expect(ProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    expect(res.length).toBe(1);
  });
});

describe("get product - service", () => {
  it("success", async () => {
    (ProductRepository.getProductById as jest.Mock).mockResolvedValue(
      createdProduct
    );

    const res = await getProduct(id);

    expect(ProductRepository.getProductById).toHaveBeenCalledTimes(1);
    expect(res).toBe(createdProduct);
  });
});
