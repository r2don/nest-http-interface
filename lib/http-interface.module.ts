import { type DynamicModule } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { FetchHttpClient } from './supports/fetch-http-client';
import { NodeFetchInjector } from './supports/node-fetch.injector';
import { type HttpClient } from './types';

export interface HttpInterfaceConfig {
  timeout?: number;
  httpClient?: HttpClient;
}

export class HttpInterfaceModule {
  static forRoot(config: HttpInterfaceConfig = {}): DynamicModule {
    return {
      global: true,
      imports: [DiscoveryModule],
      module: HttpInterfaceModule,
      providers: [
        {
          provide: NodeFetchInjector,
          inject: [MetadataScanner, DiscoveryService],
          useFactory: (
            metadataScanner: MetadataScanner,
            discoveryService: DiscoveryService,
          ) => {
            const timeout = config.timeout ?? 5000;

            return new NodeFetchInjector(
              metadataScanner,
              discoveryService,
              config.httpClient ?? new FetchHttpClient(timeout),
            );
          },
        },
      ],
    };
  }
}
