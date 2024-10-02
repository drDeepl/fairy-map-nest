import * as Joi from 'joi';

export const environmentsVariablesValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  GLOBAL_PREFIX_APP: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  SWAGGER_TITLE: Joi.string().required(),
  SWAGGER_URL: Joi.string().required(),
  APP_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXP: Joi.string().required(),
  JWT_REFRESH_EXP: Joi.string().required(),
  SWAGGER_TAB_TITLE: Joi.string().required(),
  SWAGGER_DESCRIPTION: Joi.string().required(),
  SWAGGER_VERSION: Joi.string().required(),
  SWAGGER_BEARER_AUTH_TYPE: Joi.string().default('http'),
  SWAGGER_BEARER_FORMAT: Joi.string().default('bearer'),
  SWAGGER_BEARER_SCHEME: Joi.string().default('bearer'),
  SWAGGER_BEARER_IN: Joi.string().default('header'),
  SWAGGER_BEARER_NAME: Joi.string().default('JWT-Auth'),
  SWAGGER_BEARER_SECURITY_REQ: Joi.string().default('JWT-Auth'),
});
