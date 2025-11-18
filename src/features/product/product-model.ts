import { model, Schema } from 'mongoose';
import { Product } from './product-types';

const priceConfigurationSchema = new Schema({
  priceType: {
    type: String,
    enum: ['base', 'additional'],
  },
  availableOptions: {
    type: Map,
    of: Number,
  },
});

const attributeValueSchema = new Schema({
  name: String,
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
    priceConfigurationSchema: {
      type: Map,
      of: priceConfigurationSchema,
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

const ProductModel = model<Product>('Product', productSchema);
export default ProductModel;
