import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import config from 'config';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import logger from '../../config/logger';

export default expressjwt({
  secret: expressJwtSecret({
    jwksUri: config.get('auth.jwksUri'),
    cache: true,
    rateLimit: true,
    handleSigningKeyError: (err) => {
      logger.error(`Auth key retrival failed`, { err });
      throw createHttpError(
        StatusCodes.UNAUTHORIZED,
        'Auth key retrieval failed',
      );
    },
  }),
  algorithms: ['RS256'],
  getToken: (req: Request) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }

    type AuthCookie = {
      accessToken: string;
    };

    const { accessToken } = req.cookies as AuthCookie;

    return accessToken;
  },
});
