import { Logger } from 'winston';
import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { CategoryInput } from './category-schema';
import { CategoryService } from './category-service';

export class CategoryController extends BaseController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger,
  ) {
    super();
  }
  create: ControllerHandler = async (req, res) => {
    const payload = req.body as CategoryInput;
    this.logger.info(`Payload received for create category`);
    res.json(payload);
    return;

    const category = await this.categoryService.create(payload);
    this.sendResponse(
      res,
      {
        message: `Category created with ID ${category._id.toString()}`,
      },
      201,
    );
  };
}
