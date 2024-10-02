import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  documentBuilder: {
    title: process.env.SWAGGER_TITLE,
    tabTitle: process.env.SWAGGER_TAB_TITLE,
    appUrl: process.env.APP_URL,
    description: process.env.SWAGGER_DESCRIPTION,
    version: process.env.SWAGGER_VERSION,
    bearerAuth: {
      options: {
        type: process.env.SWAGGER_BEARER_AUTH_TYPE,
        bearerFormat: process.env.SWAGGER_BEARER_FORMAT,
        scheme: process.env.SWAGGER_BEARER_SCHEMA,
        in: process.env.SWAGGER_BEARER_IN,
      },
      name: process.env.SWAGGER_BEARER_NAME,
    },
    securityRequirements: {
      name: process.env.SWAGGER_BEARER_NAME,
    },
  },
  appUrl: process.env.APP_URL,
  swaggerUrl: process.env.SWAGGER_URL,
}));
