import { model, Schema, Document } from 'mongoose';
import { Product } from './product-types';

const priceConfigurationSchema = new Schema({
  priceType: {
    type: String,
    enum: ['base', 'additional'],
    required: true,
  },
  // if you expect fixed sizes, model them explicitly
  availableOptions: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true },
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

const ProductModel = model<Product & Document>('Product', productSchema);
export default ProductModel;
