import { TransformedErrors } from '../validation-exception-factory';

export interface HttpErrorPayload {
  statusCode: number;
  message: string;
  validationErrors?: TransformedErrors;
}
