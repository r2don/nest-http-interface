import { Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { ClientModule } from './client/client.module';
import { HttpInterfaceModule } from '@r2don/nest-http-interface';

@Module({
  imports: [HttpInterfaceModule.forRoot(), ServerModule, ClientModule],
})
export class AppModule {}
