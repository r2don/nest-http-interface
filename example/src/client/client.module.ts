import { Module } from '@nestjs/common';
import { ClientHttpService } from './client.http.service';
import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  providers: [ClientHttpService],
})
export class ClientModule {}
