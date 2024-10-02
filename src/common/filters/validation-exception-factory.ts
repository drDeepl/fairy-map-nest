import { ValidationError } from '@nestjs/common';
import { ValidationException } from './validation.exception';

export interface TransformedErrors {
  [key: string]: string[];
}

function transformErrors(errors: ValidationError[]): TransformedErrors {
  console.log(transformErrors.name);
  const validationErrors: TransformedErrors = errors.reduce(
    (acc: TransformedErrors, error: ValidationError) => {
      if (error.children?.length && error.children.length !== 0) {
        const childrenErrors = error.children as ValidationError[];

        return { ...acc, ...transformErrors(childrenErrors) };
      }
      acc[error.property] = error.constraints
        ? Object.values(error.constraints)
        : [];

      return acc;
    },
    {},
  );
  return validationErrors;
}

function validationExceptionFactory(validationErrors: ValidationError[]) {
  return new ValidationException(transformErrors(validationErrors));
}

export default validationExceptionFactory;
