import express from 'express';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';
import authenticate from '../../shared/middleware/authenticate';
import authrorize from '../../shared/middleware/authorize';

import { ProductService } from './product-service';
import { ProductController } from './product-controller';
import { validateInput } from '../../shared/middleware/validate-input';
import { productCreateSchema } from './product-schema';
import { Roles } from '../../shared/utils/constants';
import { StatusCodes } from 'http-status-codes';
import { S3StorageService } from '../../shared/services/s3-storage';

const productRouter = express.Router();

const productService = new ProductService();
const s3Storage = new S3StorageService();
const productController = new ProductController(productService, s3Storage);

productRouter.route('/').post(
  authenticate,
  authrorize(Roles.ADMIN, Roles.MANAGER),
  fileUpload({
    limits: { fileSize: 1024 * 1024 },
    abortOnLimit: true,

    limitHandler: (req, res, next) => {
      const err = createHttpError(
        StatusCodes.BAD_REQUEST,
        'File size exceeds the limit',
      );
      return next(err);
    },
  }),
  validateInput(productCreateSchema),
  productController.create,
);

export default productRouter;
