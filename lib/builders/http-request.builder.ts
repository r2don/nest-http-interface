import { type PathVariableBuilder } from "./path-variable.builder";
import { type RequestBodyBuilder } from "./request-body.builder";
import { type RequestFormBuilder } from "./request-form.builder";
import { type RequestHeaderBuilder } from "./request-header.builder";
import { type RequestParamBuilder } from "./request-param.builder";
import { UrlBuilder } from "./url.builder";
import {
  PATH_VARIABLE_METADATA,
  REQUEST_BODY_METADATA,
  REQUEST_FORM_METADATA,
  REQUEST_HEADER_METADATA,
  REQUEST_PARAM_METADATA,
} from "../decorators";
import { type HttpMethod } from "../types/http-method";

export class HttpRequestBuilder {
  private baseUrl = "";
  private readonly pathVariableBuilder?: PathVariableBuilder;
  private readonly requestParamBuilder?: RequestParamBuilder;
  private readonly requestBodyBuilder?: RequestBodyBuilder;
  private readonly requestFormBuilder?: RequestFormBuilder;
  private readonly requestHeaderBuilder?: RequestHeaderBuilder;

  constructor(
    readonly target: object,
    readonly propertyKey: string,
    readonly method: HttpMethod,
    readonly url: string
  ) {
    this.pathVariableBuilder = this.getMetadata(PATH_VARIABLE_METADATA);
    this.requestParamBuilder = this.getMetadata(REQUEST_PARAM_METADATA);
    this.requestBodyBuilder = this.getMetadata(REQUEST_BODY_METADATA);
    this.requestFormBuilder = this.getMetadata(REQUEST_FORM_METADATA);
    this.requestHeaderBuilder = this.getMetadata(REQUEST_HEADER_METADATA);
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  build(args: any[]): Request {
    const payload =
      this.requestBodyBuilder?.build(args) ??
      this.requestFormBuilder?.build(args);
    const urlBuilder = new UrlBuilder(
      this.baseUrl,
      this.url,
      args,
      this.pathVariableBuilder,
      this.requestParamBuilder
    );
    const headers = this.requestHeaderBuilder?.build(args);

    return new Request(urlBuilder.build(), {
      method: this.method,
      headers,
      body: payload,
    });
  }

  getMetadata<T>(key: symbol): T | undefined {
    return Reflect.getMetadata(key, this.target, this.propertyKey);
  }
}
