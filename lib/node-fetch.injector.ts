import { Injectable, type OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { type InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { type HttpRequestBuilder } from "./builders/http-request.builder";
import { HTTP_EXCHANGE_METADATA, HTTP_INTERFACE_METADATA } from "./decorators";
import { HttpClient } from "./types/http-client.interface";

@Injectable()
export class NodeFetchInjector implements OnModuleInit {
  constructor(
    private readonly metadataScanner: MetadataScanner,
    private readonly discoveryService: DiscoveryService,
    private readonly httpClient: HttpClient
  ) {}

  onModuleInit(): void {
    const httpProviders = this.getHttpProviders();

    httpProviders.forEach((wrapper) => {
      const baseUrl: string | undefined = Reflect.getMetadata(
        HTTP_INTERFACE_METADATA,
        wrapper.metatype.prototype
      );

      if (baseUrl == null) {
        return;
      }

      this.wrapMethods(wrapper, baseUrl);
    });
  }

  private wrapMethods(wrapper: InstanceWrapper, baseUrl: string): void {
    const prototype = wrapper.metatype.prototype;

    this.metadataScanner.getAllMethodNames(prototype).forEach((methodName) => {
      const httpRequestBuilder: HttpRequestBuilder | undefined =
        Reflect.getMetadata(HTTP_EXCHANGE_METADATA, prototype, methodName);

      if (httpRequestBuilder == null) {
        return;
      }

      httpRequestBuilder.setBaseUrl(baseUrl);

      wrapper.instance[methodName] = async (...args: never[]) =>
        await this.httpClient
          .request(httpRequestBuilder.build(args))
          .then(async (response) => await response.json());
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
}
