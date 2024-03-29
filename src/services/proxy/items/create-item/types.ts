import { ItemInterface } from "@/types/item";

export interface ItemParamsInterface {
  name: string;
  modelPath: string;
  image:string;
  categoryId: number;
}

export interface CreateItemProxyTransformInterface {
  data: {
    item: ItemInterface;
  };
}

export interface CreateItemProxyResponseInterface {
  data: {
    item: ItemInterface;
  };
}
