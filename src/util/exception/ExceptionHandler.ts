import { CodeMessage } from './types/CodeMessage';

export class ExceptionHandler {
  codeMessage: object;

  constructor(codeMessage: CodeMessage) {
    this.codeMessage = codeMessage;
  }
}
