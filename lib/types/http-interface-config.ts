import { type ClassTransformOptions } from 'class-transformer';
import { type HttpClient } from './http-client.interface';

export interface HttpInterfaceConfig {
  timeout?: number;
  httpClient?: HttpClient;
  transformOption?: ClassTransformOptions;
}
