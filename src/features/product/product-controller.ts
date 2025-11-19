import { v4 as uuidv4 } from 'uuid';

import { FileStorage } from '../../shared/types/storage';
import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { ProductCreateInput } from './product-schema';
import { ProductService } from './product-service';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

export class ProductController extends BaseController {
  constructor(
    private readonly productService: ProductService,
    private readonly storage: FileStorage,
  ) {
    super();
  }
  create: ControllerHandler = async (req, res) => {
    // TODO: upload image

    const image = req.files!.image as UploadedFile;
    const ext = path.extname(image.name);
    const contentType = image.mimetype;
    const imageName = `${uuidv4()}${ext}`;

    await this.storage.upload({
      filename: imageName,
      fileData: image.data,
      contentType,
    });

    const newPayload = {
      ...(req.body as ProductCreateInput),
      image: imageName,
    };
    const product = await this.productService.create(newPayload);

    res.json({
      message: 'Product has been created',
      id: product._id,
      uri: this.storage.getObjectUri(imageName),
    });
  };
}
