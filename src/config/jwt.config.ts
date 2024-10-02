import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  user: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET_USER,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_USER,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET_USER,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_USER,
    },
  },
  moder: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET_MODER,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_MODER,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET_MODER,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_MODER,
    },
  },
  admin: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET_ADMIN,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_ADMIN,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET_ADMIN,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_ADMIN,
    },
  },
}));
