import { type PathVariableBuilder } from './path-variable.builder';
import { PayloadBuilder } from './payload.builder';
import { type RequestHeaderBuilder } from './request-header.builder';
import { type RequestParamBuilder } from './request-param.builder';
import { UrlBuilder } from './url.builder';
import {
  PATH_VARIABLE_METADATA,
  REQUEST_BODY_METADATA,
  REQUEST_FORM_METADATA,
  REQUEST_HEADER_METADATA,
  REQUEST_PARAM_METADATA,
} from '../decorators';
import { type HttpClientOptions, type HttpMethod } from '../types';

export class HttpRequestBuilder {
  private baseUrl = '';
  private readonly pathVariableBuilder?: PathVariableBuilder;
  private readonly requestParamBuilder?: RequestParamBuilder;
  private readonly requestHeaderBuilder?: RequestHeaderBuilder;
  private readonly payloadBuilder: PayloadBuilder;

  constructor(
    readonly target: object,
    readonly propertyKey: string,
    readonly method: HttpMethod,
    readonly url: string,
    readonly gqlQuery?: string,
    readonly options?: HttpClientOptions,
  ) {
    this.pathVariableBuilder = this.getMetadata(PATH_VARIABLE_METADATA);
    this.requestParamBuilder = this.getMetadata(REQUEST_PARAM_METADATA);
    this.requestHeaderBuilder = this.getMetadata(REQUEST_HEADER_METADATA);
    this.payloadBuilder = new PayloadBuilder(
      this.getMetadata(REQUEST_BODY_METADATA),
      this.getMetadata(REQUEST_FORM_METADATA),
      gqlQuery,
    );
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  build(args: any[]): Request {
    const urlBuilder = new UrlBuilder(
      this.baseUrl,
      this.url,
      args,
      this.pathVariableBuilder,
      this.requestParamBuilder,
    );
    const payload = this.payloadBuilder.build(args);
    const headers = this.requestHeaderBuilder?.build(args);

    return new Request(urlBuilder.build(), {
      method: this.method,
      headers: {
        ...headers,
        ...this.payloadBuilder.contentType,
      },
      body: payload,
    });
  }

  getMetadata<T>(key: symbol): T | undefined {
    return Reflect.getMetadata(key, this.target, this.propertyKey);
  }
}
