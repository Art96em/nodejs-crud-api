export type ProductInputType = {
  name: string;
  description: string;
  price: number;
  quantity: number;
};

export type ProductUpdateType = Partial<ProductInputType>;
