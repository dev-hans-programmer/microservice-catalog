import express from 'express';
import { CategoryController } from './category-controller';
import { validateInput } from '../../shared/middleware/validate-input';
import { categorySchema } from './category-schema';

const categoryRouter = express.Router();

const categoryController = new CategoryController();

categoryRouter
  .route('/')
  .post(validateInput(categorySchema), categoryController.create);

export default categoryRouter;
