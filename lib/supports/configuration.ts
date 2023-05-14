import { type ClassTransformOptions } from 'class-transformer';
import type CircuitBreaker from 'opossum';
import { FetchHttpClient } from './fetch-http-client';
import { type HttpClient, type HttpInterfaceConfig } from '../types';

export class Configuration {
  static DEFAULT_TIMEOUT = 5000;
  static DEFAULT_HTTP_CLIENT = FetchHttpClient;

  constructor(private readonly config: HttpInterfaceConfig = {}) {}

  get timeout(): number {
    return this.config.timeout ?? Configuration.DEFAULT_TIMEOUT;
  }

  get httpClient(): HttpClient {
    return (
      this.config.httpClient ??
      new Configuration.DEFAULT_HTTP_CLIENT(this.timeout)
    );
  }

  get transformOption(): ClassTransformOptions | undefined {
    return this.config.transformOption;
  }

  get circuitBreakerOption(): CircuitBreaker.Options | undefined {
    if (this.config.circuitBreakerOption == null) {
      return undefined;
    }

    return {
      ...this.config.circuitBreakerOption,
      timeout: this.timeout,
    };
  }
}
