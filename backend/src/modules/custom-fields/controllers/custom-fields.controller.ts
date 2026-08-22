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
import { CreateCustomFieldDto } from '../dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';
import { CustomFieldsService } from '../services/custom-fields.service';

@Controller('custom-fields')
@Authenticated()
export class CustomFieldsController {
  constructor(private readonly service: CustomFieldsService) {}

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
    @Body() dto: CreateCustomFieldDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.service.create(dto, userId);
  }

  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomFieldDto,
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
