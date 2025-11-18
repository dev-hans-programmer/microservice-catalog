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
  value: string;
}
export interface Product {
  name: string;
  description: string;
  categoryId: string;
  image: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
  tenantId: string;
}
