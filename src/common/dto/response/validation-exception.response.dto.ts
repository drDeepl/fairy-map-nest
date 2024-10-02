import { ApiProperty } from '@nestjs/swagger';

export class ValidationExceptionResponseDto {
  @ApiProperty({
    description: 'статус код',
    nullable: false,
    required: true,
  })
  readonly statusCode: number;

  @ApiProperty({
    description: 'описание ошибки',
    nullable: false,
    required: true,
  })
  readonly message: string;

  @ApiProperty({
    description: 'объекто с полями и массивом ошибок их',
    nullable: false,
    required: true,
    example: { propertyName: ['message1', 'message2'] },
  })
  readonly validationErrors: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    validationErrors: Record<string, string[]>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.validationErrors = validationErrors;
  }
}
