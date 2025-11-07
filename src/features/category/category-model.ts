import { model, Schema } from 'mongoose';
import { Attribute, Category, PriceConfiguration } from './category-types';

const priceConfigurationSchema = new Schema<PriceConfiguration>(
  {
    priceType: {
      type: String,
      enum: ['base', 'additional'],
      required: true,
    },
    availableOptions: {
      type: [String],
      required: true,
    },
  },
  { _id: false },
);
const attributeSchema = new Schema<Attribute>(
  {
    name: {
      type: String,
      required: true,
    },
    widgetType: {
      type: String,
      enum: ['switch', 'radio'],
      required: true,
    },
    availableOptions: {
      type: [String],
      required: true,
    },
    defaultValue: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false, timestamps: true, versionKey: false },
);

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: [true, 'Please provide a name for category'],
  },
  priceConfiguration: {
    type: Map,
    of: priceConfigurationSchema,
    required: true,
  },
  attributes: {
    type: [attributeSchema],
    required: true,
  },
});

const CategoryModel = model<Category>('Category', categorySchema);
export default CategoryModel;

/**
 * 
 * Here type Map will work fine but not good for performance, instead we can have the type below like this
 * priceConfiguration: {
  type: [
    {
      key: { type: String, required: true },
      priceType: { type: String, enum: ['base', 'additional'], required: true },
      availableOptions: { type: [String], required: true },
    },
  ],
  required: true,
},
This will make querying, indexing easier and faster
 */
