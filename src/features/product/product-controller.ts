import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { ProductCreateInput } from './product-schema';
import { ProductService } from './product-service';

export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }
  create: ControllerHandler = async (req, res) => {
    // TODO: upload image

    const newPayload = {
      ...(req.body as ProductCreateInput),
      image: 'tt',
    };
    const product = await this.productService.create(newPayload);
    res.json({ message: 'Product has been created', id: product._id });
  };
}
