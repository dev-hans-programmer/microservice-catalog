import express from 'express';
import { CategoryController } from './category-controller';
import { validateInput } from '../../shared/middleware/validate-input';
import { categorySchema } from './category-schema';
import { CategoryService } from './category-service';
import logger from '../../config/logger';
import authenticate from '../../shared/middleware/authenticate';
import authrorize from '../../shared/middleware/authorize';
import { Roles } from '../../shared/utils/constants';

const categoryRouter = express.Router();

const categoryService = new CategoryService();

const categoryController = new CategoryController(categoryService, logger);

categoryRouter
  .route('/')
  .post(
    authenticate,
    authrorize(Roles.ADMIN),
    validateInput(categorySchema),
    categoryController.create,
  );

export default categoryRouter;
