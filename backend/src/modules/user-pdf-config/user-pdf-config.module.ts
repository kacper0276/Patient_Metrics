import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPdfConfig } from './entities/user-pdf-config.entity';
import { UserPdfConfigController } from './controllers/user-pdf-config.controller';
import { UserPdfConfigRepository } from './repositories/user-pdf-config.repository';
import { UserPdfConfigService } from './services/user-pdf-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPdfConfig])],
  controllers: [UserPdfConfigController],
  providers: [UserPdfConfigRepository, UserPdfConfigService],
  exports: [UserPdfConfigService],
})
export class UserPdfConfigModule {}
