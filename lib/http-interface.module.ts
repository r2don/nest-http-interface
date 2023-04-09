import { type DynamicModule } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { NodeFetchInjector } from "./node-fetch.injector";

export interface HttpInterfaceConfig {
  timeout?: number;
}

export class HttpInterfaceModule {
  static register(config: HttpInterfaceConfig): DynamicModule {
    return {
      imports: [DiscoveryModule],
      module: HttpInterfaceModule,
      providers: [NodeFetchInjector],
    };
  }
}
