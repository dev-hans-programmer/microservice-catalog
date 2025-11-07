export interface PriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'additional';
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: 'switch' | 'radio';
  availableOptions: string[];
  defaultValue: string;
}

export interface Category {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}
