import mongoose from 'mongoose';

export interface PriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'additional';
    availableOptions: {
      small: number;
      medium: number;
      large: number;
    };
  };
}

export interface Attribute {
  name: string;
  // attributes can be booleans, numbers or strings (see `attributes.json`)
  value: string | number | boolean;
}
export interface Product {
  name: string;
  description: string;
  categoryId: string;
  image: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
  tenantId: string;
  // optional fields populated by Mongoose
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Filter {
  tenantId?: string;
  categoryId?: mongoose.Types.ObjectId;
  isPublished?: boolean;
}
