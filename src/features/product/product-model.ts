import {
  model,
  Schema,
  Document,
  AggregatePaginateModel,
  AggregatePaginateResult,
} from 'mongoose';
import { Product } from './product-types';

import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const priceConfigurationSchema = new Schema({
  priceType: {
    type: String,
    enum: ['base', 'additional'],
    required: true,
  },
  // if you expect fixed sizes, model them explicitly
  availableOptions: {
    type: Map,
    of: Number,
  },
});

const attributeValueSchema = new Schema({
  name: { type: String, required: true },
  value: Schema.Types.Mixed,
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product is required'],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // store price configurations keyed by some identifier (e.g. size key or variant)
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
      required: true,
    },
    attributes: {
      type: [attributeValueSchema],
    },
    tenantId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(aggregatePaginate);

// Document type for a Product (mongoose Document + our Product interface)
export type ProductDocument = Product & Document;

// Create the model with the plugin model type so TypeScript recognizes
// `aggregatePaginate` on the returned model.
const ProductModel = model<
  ProductDocument,
  AggregatePaginateModel<ProductDocument>
>('Product', productSchema);

export default ProductModel;

export type { AggregatePaginateResult };
