import ProductModel from './product-model';
import { ProductCreateInput } from './product-schema';

export class ProductService {
  create = (payload: ProductCreateInput) => ProductModel.create(payload);
}
