import express from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import { globalErrorHandler } from './shared/middleware/global-error-handler';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello catalog service' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, _res, _next) => {
  throw createHttpError(
    StatusCodes.NOT_FOUND,
    `Can't find route ${req.originalUrl} on the server global`,
  );
});

app.use(globalErrorHandler);

export default app;
