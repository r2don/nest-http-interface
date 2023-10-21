import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ClientHttpService } from './client.http.service';
import { CreateServerDto } from '../server/dto/create-server.dto';
import { UpdateServerDto } from '../server/dto/update-server.dto';
import { Server } from '../server/entities/server.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientHttpService) {}

  @Post()
  async create(@Body() createClientDto: CreateServerDto): Promise<Server> {
    return await this.clientService.create(createClientDto);
  }

  @Get()
  findAll(): Promise<Server[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Server> {
    return this.clientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
  ): Promise<void> {
    return this.clientService.update(+id, updateServerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.clientService.remove(+id);
  }
}
