import { ItemInterface } from "@/types/item";

export interface ItemParamsInterface {
  name: string;
  modelPath: string;
  image:string;
  categoryId: number;
}

export interface CreateItemApiResponseInterface {
    data: {
      item: ItemInterface;
    };
    code?: number;
    message?: string;
    errors?: string[];
    status?: string;
  }
  