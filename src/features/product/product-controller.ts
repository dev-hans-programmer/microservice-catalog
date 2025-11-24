import path from 'path';
import createHttpError from 'http-errors';

import { v4 as uuidv4 } from 'uuid';
import { FileStorage } from '../../shared/types/storage';
import { BaseController, ControllerHandler } from '../../shared/utils/response';
import { ProductCreateInput, ProductUpdateInput } from './product-schema';
import { ProductService } from './product-service';
import { UploadedFile } from 'express-fileupload';
import { StatusCodes } from 'http-status-codes';
import { Roles } from '../../shared/utils/constants';

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

    this.sendResponse(
      res,
      {
        message: 'Product has been created',
        id: product._id,
        uri: this.storage.getObjectUri(imageName),
      },
      StatusCodes.CREATED,
    );
  };
  update: ControllerHandler = async (req, res) => {
    const { productId } = req.params;

    const product = await this.productService.getById(productId!);

    if (!product)
      throw createHttpError(StatusCodes.NOT_FOUND, 'Product not found');
    // check if tenant matches

    if (req.auth.role !== Roles.ADMIN) {
      if (req.auth.tenant !== product.tenantId)
        throw createHttpError(
          StatusCodes.FORBIDDEN,
          'You do not have permission to update this product',
        );
    }

    // Image upload

    let imageName;

    if (req.files) {
      const image = req.files.image as UploadedFile;
      const ext = path.extname(image.name);
      const contentType = image.mimetype;
      imageName = `${uuidv4()}${ext}`;

      await this.storage.upload({
        filename: imageName,
        fileData: image.data,
        contentType,
      });

      await this.storage.delete(product.image);
    }

    const updatedData = {
      ...(req.body as ProductUpdateInput),
      image: imageName ? imageName : product.image,
    };

    await this.productService.update(productId!, updatedData);

    this.sendResponse(res, {
      id: product._id,
      message: 'Product updated successfully',
    });
  };
  index: ControllerHandler = async (req, res) => {
    const products = await this.productService.getAll();

    this.sendResponse(res, { products });
  };
  getOne: ControllerHandler = async (req, res) => {
    const { productId } = req.params;
    const product = await this.productService.getById(productId!);

    this.sendResponse(res, { product });
  };
}
