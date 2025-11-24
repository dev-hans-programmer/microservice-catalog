import ProductModel from './product-model';
import { ProductCreateInput, ProductUpdateInput } from './product-schema';
import { Filter, Product } from './product-types';

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
  getAll = async (q: string, filters: Filter) => {
    const searchQueryRegexp = new RegExp(q, 'i');

    const matchQuery = {
      ...filters,
      name: searchQueryRegexp,
    };

    const aggregate = ProductModel.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$category', // will transform the array into objects
      },
    ]);

    return (await aggregate.exec()) as Product[];
  };
}
