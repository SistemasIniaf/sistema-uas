import { Module } from '@nestjs/common';

import { SemillerasService } from './semilleras.service';
import { SemillerasController } from './semilleras.controller';

@Module({
  controllers: [SemillerasController],
  providers: [SemillerasService],
  exports: [SemillerasService],
})
export class SemillerasModule {}
