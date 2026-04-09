import { Module } from '@nestjs/common';
import { NatsModule } from 'src/nats/nats.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
})
export class AuthModule {}
