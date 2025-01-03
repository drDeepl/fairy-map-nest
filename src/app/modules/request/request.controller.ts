import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { TypeRequest } from '@prisma/client';

@ApiTags('RequestController')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({ summary: 'получение существующих статусов для заявок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('/status')
  async getStatuses(): Promise<string[]> {
    return await this.requestService.getStatusRequestAll();
  }

  @ApiOperation({ summary: 'получение существующих типов заявок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('/type')
  async getTypes(): Promise<string[]> {
    return Object.keys(TypeRequest);
  }
}
