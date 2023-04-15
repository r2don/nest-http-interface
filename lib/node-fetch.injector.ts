import { Injectable, type OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { type InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import {
  HTTP_EXCHANGE_METADATA,
  HTTP_INTERFACE_METADATA,
  type HttpExchangeMetadata,
  PATH_VARIABLE_METADATA,
  type PathVariableMetadata,
  REQUEST_BODY_METADATA,
  REQUEST_PARAM_METADATA,
  type RequestBodyMetadata,
  type RequestParamMetadata,
} from "./decorators";
import { HttpClient } from "./types/http-client.interface";
import { TupleArrayBuilder } from "./utils/tuple-array-builder";
import { URLBuilder } from "./utils/url-builder";

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
      const prototype = wrapper.metatype.prototype;
      const baseUrl: string | undefined = Reflect.getMetadata(
        HTTP_INTERFACE_METADATA,
        prototype
      );

      if (typeof baseUrl === "undefined") {
        return;
      }

      this.metadataScanner
        .getAllMethodNames(prototype)
        .forEach((methodName) => {
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
          const requestParamMetadata = getMetadata<RequestParamMetadata>(
            REQUEST_PARAM_METADATA
          );
          const requestBodyMetadata = getMetadata<RequestBodyMetadata>(
            REQUEST_BODY_METADATA
          );

          wrapper.instance[methodName] = async (...args: any[]) => {
            const payload = requestBodyMetadata
              ?.toArray()
              .reduce(
                (
                  acc: Record<string, unknown>,
                  [index, value]: [number, any]
                ) => {
                  if (typeof value !== "undefined") {
                    acc[value] = args[index];
                    return acc;
                  }

                  TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
                    ([k, v]) => {
                      acc[k] = v;
                    }
                  );

                  return acc;
                },
                {}
              );

            const urlBuilder = new URLBuilder(
              baseUrl,
              httpExchangeMetadata.url,
              args,
              {
                pathParam: pathMetadata,
                queryParam: requestParamMetadata,
              }
            );

            return await this.httpClient
              .request(
                new Request(urlBuilder.build(), {
                  method: httpExchangeMetadata.method,
                  headers:
                    typeof payload !== "undefined"
                      ? { "Content-Type": "application/json" }
                      : undefined,
                  body:
                    typeof payload !== "undefined"
                      ? JSON.stringify(payload)
                      : undefined,
                })
              )
              .then(async (response) => await response.json());
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
