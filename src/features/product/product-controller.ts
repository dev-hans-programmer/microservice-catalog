import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { ProductService } from './product-service';

export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }
  create: ControllerHandler = (req, res) => {
    res.json({ message: 'Hello create product handler' });
  };
}
