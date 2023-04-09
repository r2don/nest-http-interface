import { Injectable, type OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { type InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import {
  HTTP_EXCHANGE_METADATA,
  HTTP_INTERFACE_METADATA,
  type HttpExchangeMetadata,
  PATH_VARIABLE_METADATA,
  type PathVariableMetadata,
} from "./decorators";

@Injectable()
export class NodeFetchInjector implements OnModuleInit {
  constructor(
    private readonly metadataScanner: MetadataScanner,
    private readonly discoveryService: DiscoveryService
  ) {}

  onModuleInit(): void {
    const httpProviders = this.getHttpProviders();

    httpProviders.forEach((wrapper) => {
      const prototype = wrapper.metatype.prototype;
      const baseUrl: string = Reflect.getMetadata(
        HTTP_INTERFACE_METADATA,
        prototype
      );
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      methodNames.forEach((methodName) => {
        const getMetadata = this.makeMetadataGetter(prototype, methodName);
        const httpExchangeMetadata = getMetadata<HttpExchangeMetadata>(
          HTTP_EXCHANGE_METADATA
        );

        if (typeof httpExchangeMetadata === "undefined") {
          return;
        }

        const pathMetadata = getMetadata<PathVariableMetadata>(
          PATH_VARIABLE_METADATA
        );

        wrapper.instance[methodName] = async (...args: any[]) => {
          const url = [...(pathMetadata?.entries() ?? [])].reduce(
            (url, [index, value]) => url.replace(value, args[index]),
            `${baseUrl}${httpExchangeMetadata.url}`
          );
          const request = new Request(url);

          return await fetch(request).then(
            async (response) => await response.json()
          );
        };
      });
    });
  }

  private getHttpProviders(): InstanceWrapper[] {
    return this.discoveryService.getProviders().filter((wrapper) => {
      const metadata = Reflect.getMetadata(
        HTTP_INTERFACE_METADATA,
        wrapper.metatype
      );
      return typeof metadata !== "undefined" || metadata !== null;
    });
  }

  private makeMetadataGetter(
    prototype: object,
    methodName: string
  ): <T>(key: symbol) => T | undefined {
    return (metadataKey: symbol) =>
      Reflect.getMetadata(metadataKey, prototype, methodName);
  }
}
