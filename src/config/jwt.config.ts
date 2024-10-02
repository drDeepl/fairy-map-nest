import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  patient: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET_PATIENT,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_PATIENT,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET_PATIENT,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_PATIENT,
    },
  },
  doctor: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET_DOCTOR,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_DOCTOR,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET_DOCTOR,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_DOCTOR,
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
