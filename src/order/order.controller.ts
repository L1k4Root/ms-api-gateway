import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateOrderDto,
  OrderPaginationDTO,
  ChangeOrderStatusDto,
} from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log('Creating order');
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDTO: OrderPaginationDTO) {
    return this.client.send('findAllOrders', paginationDTO);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', id);
  }

  @Patch('change-status/:id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.client.send('changeOrderStatus', {
      id,
      status: changeOrderStatusDto.status,
    });
  }

  @Post('test-pay-success')
  testPaySuccess(@Body() payload: Record<string, unknown>) {
    return this.client.send('payment.suceeded', payload);
  }
}
