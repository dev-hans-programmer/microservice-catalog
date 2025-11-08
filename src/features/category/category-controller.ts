import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { CategoryInput } from './category-schema';

export class CategoryController extends BaseController {
  create: ControllerHandler = (req, res) => {
    const payload = req.body as CategoryInput;
    this.sendResponse(
      res,
      { message: 'Category create controller method', payload },
      201,
    );
  };
}
