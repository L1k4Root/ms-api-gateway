import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return firstValueFrom(
      this.client.send('auth.register.user', registerUserDto),
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return firstValueFrom(this.client.send('auth.login.user', loginUserDto));
  }

  @Get('verify')
  async verify(@Headers('authorization') authorization?: string) {
    const token = this.extractBearerToken(authorization);

    return firstValueFrom(this.client.send('auth.verify.user', { token }));
  }

  private extractBearerToken(authorization?: string) {
    if (!authorization) {
      throw new BadRequestException('Authorization header is required');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new BadRequestException(
        'Authorization header must use Bearer token format',
      );
    }

    return token;
  }
}
