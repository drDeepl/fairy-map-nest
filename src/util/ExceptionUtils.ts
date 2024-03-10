import { Logger } from '@nestjs/common';

export const PrintNameAndCodePrismaException = (error, logger: Logger) => {
  logger.error(`name: ${error?.name}\ncode: ${error?.code}`);
  logger.error(error);
};
