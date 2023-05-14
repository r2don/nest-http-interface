import { type DynamicModule } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { Configuration } from './supports/configuration';
import { NodeFetchInjector } from './supports/node-fetch.injector';
import { type HttpInterfaceConfig } from './types';

export class HttpInterfaceModule {
  static forRoot(config?: HttpInterfaceConfig): DynamicModule {
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
          ) =>
            new NodeFetchInjector(
              metadataScanner,
              discoveryService,
              new Configuration(config),
            ),
        },
      ],
    };
  }
}
