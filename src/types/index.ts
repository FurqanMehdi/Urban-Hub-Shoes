export interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  category: string;
  stock: number;
  featured?: boolean;
  trending?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  _id?: string;
  product: Product | string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'pending' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
  createdAt?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}
