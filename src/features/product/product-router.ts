import express from 'express';
import { ProductService } from './product-service';
import { ProductController } from './product-controller';
import { validateInput } from '../../shared/middleware/validate-input';
import { productCreateSchema } from './product-schema';
import authenticate from '../../shared/middleware/authenticate';
import authrorize from '../../shared/middleware/authorize';
import { Roles } from '../../shared/utils/constants';

const productRouter = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService);

productRouter
  .route('/')
  .post(
    authenticate,
    authrorize(Roles.ADMIN, Roles.MANAGER),
    validateInput(productCreateSchema),
    productController.create,
  );

export default productRouter;
