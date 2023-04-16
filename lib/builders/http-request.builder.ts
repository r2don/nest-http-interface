import { type PathVariableBuilder } from "./path-variable.builder";
import { type RequestBodyBuilder } from "./request-body.builder";
import { type RequestParamBuilder } from "./request-param.builder";
import { UrlBuilder } from "./url.builder";
import {
  PATH_VARIABLE_METADATA,
  REQUEST_BODY_METADATA,
  REQUEST_PARAM_METADATA,
} from "../decorators";
import { type HttpMethod } from "../types/http-method";

export class HttpRequestBuilder {
  private baseUrl = "";
  private readonly pathVariableBuilder: PathVariableBuilder | undefined;
  private readonly requestParamBuilder: RequestParamBuilder | undefined;
  private readonly requestBodyBuilder: RequestBodyBuilder | undefined;

  constructor(
    readonly target: object,
    readonly propertyKey: string,
    readonly method: HttpMethod,
    readonly url: string
  ) {
    this.pathVariableBuilder = this.getMetadata(PATH_VARIABLE_METADATA);
    this.requestParamBuilder = this.getMetadata(REQUEST_PARAM_METADATA);
    this.requestBodyBuilder = this.getMetadata(REQUEST_BODY_METADATA);
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  build(args: any[]): Request {
    const payload = this.requestBodyBuilder?.build(args);
    const urlBuilder = new UrlBuilder(this.baseUrl, this.url, args, {
      pathParam: this.pathVariableBuilder,
      queryParam: this.requestParamBuilder,
    });

    return new Request(urlBuilder.build(), {
      method: this.method,
      headers:
        payload !== undefined
          ? { "Content-Type": "application/json" }
          : undefined,
      body: payload,
    });
  }

  getMetadata<T>(key: symbol): T | undefined {
    return Reflect.getMetadata(key, this.target, this.propertyKey);
  }
}
