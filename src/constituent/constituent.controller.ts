import { TokensDto } from '@/auth/dto/tokens.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstituentsService } from './constituent.service';
import { AddConstituentDto } from './dto/AddConstituentDto';

@ApiTags('ConstituentController')
@Controller('api/constituent')
export class ConstituentsController {
  private readonly logger = new Logger('AuthService');
  constructor(private readonly constituentService: ConstituentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'запрос на вход' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TokensDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async addConstituent(@Body() dto: AddConstituentDto) {
    this.logger.warn('ADD CONSTITUENT');
    return this.constituentService.addNewConstituent(dto);
  }
}
