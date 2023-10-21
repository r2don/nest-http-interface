import { PartialType } from '@nestjs/mapped-types';
import { CreateServerDto } from './create-server.dto';

export class UpdateServerDto extends PartialType(CreateServerDto) {}
