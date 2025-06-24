import { INestApplication } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUI } from './swagger-ui.main';
import { SwaggerConfig } from 'src/config/interfaces/swagger-config.interface';

class SwaggerDocumentBuilder {
  constructor(
    private readonly app: INestApplication<any>,
    private readonly swaggerConfig: SwaggerConfig,
  ) {}

  private buildConfig() {
    const swaggerConfig = {
      options: {
        type: this.swaggerConfig.documentBuilder.bearerAuth.options.type,
        scheme: this.swaggerConfig.documentBuilder.bearerAuth.options.scheme,
        bearerFormat:
          this.swaggerConfig.documentBuilder.bearerAuth.options.bearerFormat,
      },
      securitySchemeType: this.swaggerConfig.documentBuilder.bearerAuth.name,
    };
    console.log(swaggerConfig);
    const docBuilder = new DocumentBuilder()
      .setTitle(this.swaggerConfig.documentBuilder.title)
      .addServer(this.swaggerConfig.documentBuilder.appUrl)
      .setDescription(this.swaggerConfig.documentBuilder.description)
      .setVersion(this.swaggerConfig.documentBuilder.version)
      .addBearerAuth(swaggerConfig.options, swaggerConfig.securitySchemeType)
      .addSecurityRequirements(
        this.swaggerConfig.documentBuilder.securityRequirements.name,
      );

    return docBuilder.build();
  }

  private createDocument() {
    const config = this.buildConfig();
    return SwaggerModule.createDocument(this.app, config);
  }

  public setupSwagger() {
    const document = this.createDocument();
    const swaggerUI = new SwaggerUI(
      this.swaggerConfig.documentBuilder.tabTitle,
    );

    SwaggerModule.setup(
      this.swaggerConfig.swaggerUrl,
      this.app,
      document,
      swaggerUI.customOptions,
    );
  }
}

export default SwaggerDocumentBuilder;
