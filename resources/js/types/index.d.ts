import { Config } from 'ziggy-js';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type Image = {
  id: number;
  thumb: string;
  small: string;
  large: string;
}

export type VariationTypeOption = {
  id: number;
  name: string;
  images: Image[];
  type: VariationType;
}

export type VariationType = {
  id: number;
  name: string;
  type: 'Select' | 'Image' | 'Radio';
  options: VariationTypeOption[];
}

export type Product = {
  id: number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  price: number;
  quantity: number;
  image: string;
  images: Image[];
  description: string;
  short_description: string;
  user: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
    slug: string;
  };
  variationTypes: VariationType[],
  variations: Array<{
    id: number;
    variation_type_option_ids: number[];
    quantity: number;
    price: number;
  }>
}

export type CartItem = {
  id: string;
  product_id: number;
  title: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
  option_ids: Record<string, number>;
  options: VariationTypeOption[];
}

export type GroupedCartItems = {
  user: User;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export type Category = {
  id: number;
  name: string;
}

export type Department = {
  id: number;
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  categories: Category[]
}

export type Order = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  user: User;
  vendorUser: {
    id: number;
    name: string;
    email: string;
    store_name: string;
    store_address: string;
  };
  items: OrderItem[];
}

export type OrderItem = {
  id: number;
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
  };
  price: number;
  quantity: number;
  variation_type_option_ids: number[];
  description: string;
}

export type PaginationProps<T> = {
  data: Array<T>;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  appName: string;
  csrf_token: string;
  error: string;
  success: {
    message: string;
    time: number;
  };
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
  totalQuantity: number;
  totalPrice: number;
  miniCartItems: CartItem[],
  departments: Department[],
  keyword: string,
};
