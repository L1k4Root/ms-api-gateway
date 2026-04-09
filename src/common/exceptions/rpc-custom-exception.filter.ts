import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorResponse {
  code: number;
  message: string;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const httpResponse = host.switchToHttp().getResponse<Response>();
    const errorResponse = exception.getError();

    if (exception.toString().includes('Empty response')) {
      httpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error: Empty response from microservice',
      });
      return;
    }

    if (
      typeof errorResponse === 'object' &&
      errorResponse !== null &&
      'code' in errorResponse &&
      'message' in errorResponse
    ) {
      const { code, message } = errorResponse as RpcErrorResponse;
      httpResponse.status(code).json({
        statusCode: code,
        message,
      });
      return;
    }

    httpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected RPC error',
    });
  }
}
