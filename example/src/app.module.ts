import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';

@Module({
  imports: [ServerModule],
})
export class AppModule {}
