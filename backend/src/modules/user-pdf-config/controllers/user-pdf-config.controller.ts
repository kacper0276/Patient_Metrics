import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { Authenticated } from '@core/decorators/authenticated.decorator';
import { CreateUserPdfConfigDto } from '../dto/create-user-pdf-config.dto';
import { UpdateUserPdfConfigDto } from '../dto/update-user-pdf-config.dto';
import { UserPdfConfigService } from '../services/user-pdf-config.service';

@Controller('user-pdf-config')
@Authenticated()
export class UserPdfConfigController {
  constructor(private readonly service: UserPdfConfigService) {}

  @Get() findAll(@CurrentUser('id') userId: number) {
    return this.service.findAll(userId);
  }

  @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.findOne(id, userId);
  }

  @Post() create(
    @Body() dto: CreateUserPdfConfigDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.create(dto, userId);
  }

  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserPdfConfigDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.update(id, dto, userId);
  }

  @Delete(':id') delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.delete(id, userId);
  }
}
