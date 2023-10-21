import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server } from './entities/server.entity';

@Injectable()
export class ServerService {
  #servers: Server[] = [];

  create(createServerDto: CreateServerDto): Server {
    const server = new Server();
    server.id = this.#servers.length + 1;
    server.name = createServerDto.name;
    server.isOnline = createServerDto.isOnline;
    this.#servers.push(server);

    return server;
  }

  findAll(): Server[] {
    return this.#servers;
  }

  findOne(id: number): Server | undefined {
    return this.#servers.find((server) => server.id === id);
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    this.#servers = this.#servers.map((server) => {
      if (server.id === id) {
        return {
          ...server,
          ...updateServerDto,
        };
      }

      return server;
    });
  }

  remove(id: number) {
    const index = this.#servers.findIndex((server) => server.id === id);
    this.#servers.splice(index, 1);
  }
}
