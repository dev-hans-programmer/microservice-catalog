import ProductModel from './product-model';
import { ProductCreateInput, ProductUpdateInput } from './product-schema';

export class ProductService {
  create = (payload: ProductCreateInput) => ProductModel.create(payload);
  getById = (productId: string) => ProductModel.findById(productId);
  update = (productId: string, product: ProductUpdateInput) =>
    ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: product,
      },
      {
        new: true,
      },
    );
  getAll = () => ProductModel.find();
}
