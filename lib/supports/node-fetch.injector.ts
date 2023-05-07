import { Injectable, type OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { type InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { type HttpRequestBuilder } from '../builders/http-request.builder';
import { type ResponseBodyBuilder } from '../builders/response-body.builder';
import {
  HTTP_EXCHANGE_METADATA,
  HTTP_INTERFACE_METADATA,
  RESPONSE_BODY_METADATA,
} from '../decorators';
import { HttpClient, HttpInterfaceConfig } from '../types';

@Injectable()
export class NodeFetchInjector implements OnModuleInit {
  constructor(
    private readonly metadataScanner: MetadataScanner,
    private readonly discoveryService: DiscoveryService,
    private readonly httpClient: HttpClient,
    private readonly httpInterfaceConfig?: HttpInterfaceConfig,
  ) {}

  onModuleInit(): void {
    const httpProviders = this.getHttpProviders();

    httpProviders.forEach((wrapper) => {
      const baseUrl: string = Reflect.getMetadata(
        HTTP_INTERFACE_METADATA,
        wrapper.metatype.prototype,
      );

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

      const responseBodyBuilder: ResponseBodyBuilder<unknown> | undefined =
        Reflect.getMetadata(RESPONSE_BODY_METADATA, prototype, methodName);

      httpRequestBuilder.setBaseUrl(baseUrl);

      wrapper.instance[methodName] = async (...args: never[]) =>
        await this.httpClient
          .request(httpRequestBuilder.build(args), httpRequestBuilder.options)
          .then(async (response) => {
            if (responseBodyBuilder != null) {
              const res = await response.json();

              return responseBodyBuilder.build(
                res,
                this.httpInterfaceConfig?.transformOption,
              );
            }

            return await response.text();
          });
    });
  }

  private getHttpProviders(): InstanceWrapper[] {
    return this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.metatype?.prototype != null &&
          Reflect.hasMetadata(
            HTTP_INTERFACE_METADATA,
            wrapper.metatype.prototype,
          ),
      );
  }
}
