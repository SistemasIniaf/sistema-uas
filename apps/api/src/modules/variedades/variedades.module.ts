import { Module } from '@nestjs/common';

import { VariedadesService } from './variedades.service';
import { VariedadesController } from './variedades.controller';

@Module({
  controllers: [VariedadesController],
  providers: [VariedadesService],
  exports: [VariedadesService],
})
export class VariedadesModule {}
