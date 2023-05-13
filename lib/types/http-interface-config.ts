import { type ClassTransformOptions } from 'class-transformer';
import type CircuitBreaker from 'opossum';
import { type HttpClient } from './http-client.interface';

export interface HttpInterfaceConfig {
  timeout?: number;
  httpClient?: HttpClient;
  transformOption?: ClassTransformOptions;
  circuitBreakerOption?: CircuitBreaker.Options;
}
