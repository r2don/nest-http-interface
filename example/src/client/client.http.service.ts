import {
  DeleteExchange,
  GetExchange,
  HttpInterface,
  imitation,
  PatchExchange,
  PathVariable,
  PostExchange,
  RequestBody,
  ResponseBody,
} from '@r2don/nest-http-interface';
import { CreateServerDto } from '../server/dto/create-server.dto';
import { Server } from '../server/entities/server.entity';
import { UpdateServerDto } from '../server/dto/update-server.dto';

@HttpInterface('http://localhost:3000')
export class ClientHttpService {
  @PostExchange('/api/servers')
  @ResponseBody(Server) // you don't need to use this decorator if cli plugin is configured (see nest-cli.json)
  async create(
    @RequestBody() createServerDto: CreateServerDto,
  ): Promise<Server> {
    return imitation(createServerDto);
  }

  @GetExchange('/api/servers')
  async findAll(): Promise<Server[]> {
    return imitation();
  }

  @GetExchange('/api/servers/{id}')
  async findOne(@PathVariable('id') id: number): Promise<Server> {
    return imitation(id);
  }

  @PatchExchange('/api/servers/{id}')
  async update(
    @PathVariable('id') id: number,
    @RequestBody()
    updateServerDto: UpdateServerDto,
  ): Promise<void> {
    return imitation(id, updateServerDto);
  }

  @DeleteExchange('/api/servers/{id}')
  async remove(@PathVariable('id') id: number): Promise<void> {
    return imitation(id);
  }
}
