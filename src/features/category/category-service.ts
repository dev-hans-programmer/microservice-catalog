import CategoryModel from './category-model';
import { CategoryInput } from './category-schema';

export class CategoryService {
  constructor() {}

  create = (payload: CategoryInput) => CategoryModel.create(payload);
}
