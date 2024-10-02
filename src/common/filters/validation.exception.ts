import { BadRequestException } from '@nestjs/common';
import { TransformedErrors } from './validation-exception-factory';

export class ValidationException extends BadRequestException {
  errors: TransformedErrors;
  constructor(errors: TransformedErrors) {
    super();
    this.errors = errors;
  }
}
