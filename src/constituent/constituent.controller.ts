import { TokensDto } from '@/auth/dto/tokens.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstituentsService } from './constituent.service';
import { AddConstituentDto } from './dto/AddConstituentDto';
import { ConstituentDto } from './dto/ConstituentDto';
import { EditConstituentDto } from './dto/EditConstituentDto';

@ApiTags('ConstituentController')
@Controller('api/constituent')
export class ConstituentsController {
  private readonly logger = new Logger('ConstituentsController');
  constructor(private readonly constituentService: ConstituentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'запрос на вход' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ConstituentDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async addConstituent(
    @Body() dto: AddConstituentDto,
  ): Promise<ConstituentDto> {
    this.logger.warn('ADD CONSTITUENT');
    return this.constituentService.addNewConstituent(dto);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'запрос на вход' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [ConstituentDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getConstituents(): Promise<ConstituentDto[]> {
    this.logger.warn('GET CONSTITUENTS');
    return this.constituentService.getConstituents();
  }

  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'редактирование субъекта' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async editConstituent(
    @Param('id', ParseIntPipe) id,
    @Body() dto: EditConstituentDto,
  ) {
    this.logger.warn('EDIT CONSTITUENT');
    return this.constituentService.editConstituentById(id, dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'удаление данных субъекта' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async deleteConstituentById(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn('DELETE CONSTITUENT BY ID');
    return this.constituentService.deleteConstituentById(id);
  }
}
