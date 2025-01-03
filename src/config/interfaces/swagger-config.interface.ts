import { SecuritySchemeType } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface SwaggerConfig {
  documentBuilder: {
    title: string;
    appUrl: string;
    tabTitle: string;
    description: string;
    version: string;
    bearerAuth: {
      options: {
        type: SecuritySchemeType;
        bearerFormat: string;
        scheme: string;
        in: string;
      };
      name: string;
    };
    securityRequirements: {
      name: string;
    };
  };
  appUrl: string;
  swaggerUrl: string;
}
