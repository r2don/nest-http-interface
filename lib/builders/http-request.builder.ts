import { type PathVariableBuilder } from "./path-variable.builder";
import { type RequestParamBuilder } from "./request-param.builder";
import { TupleArrayBuilder } from "./tuple-array.builder";
import { UrlBuilder } from "./url.builder";
import {
  PATH_VARIABLE_METADATA,
  REQUEST_BODY_METADATA,
  REQUEST_PARAM_METADATA,
  type RequestBodyMetadata,
} from "../decorators";
import { type HttpMethod } from "../types/http-method";

export class HttpRequestBuilder {
  private baseUrl = "";
  private readonly pathVariableBuilder: PathVariableBuilder | undefined;
  private readonly requestParamBuilder: RequestParamBuilder | undefined;
  private readonly requestBodyMetadata: RequestBodyMetadata | undefined;

  constructor(
    readonly target: object,
    readonly propertyKey: string,
    readonly method: HttpMethod,
    readonly url: string
  ) {
    this.pathVariableBuilder = this.getMetadata(PATH_VARIABLE_METADATA);
    this.requestParamBuilder = this.getMetadata(REQUEST_PARAM_METADATA);
    this.requestBodyMetadata = this.getMetadata(REQUEST_BODY_METADATA);
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  build(args: any[]): Request {
    const payload = this.requestBodyMetadata
      ?.toArray()
      .reduce((acc: Record<string, unknown>, [index, value]: [number, any]) => {
        if (typeof value !== "undefined") {
          acc[value] = args[index];
          return acc;
        }

        TupleArrayBuilder.of<string, unknown>(args[index]).forEach(([k, v]) => {
          acc[k] = v;
        });

        return acc;
      }, {});
    const urlBuilder = new UrlBuilder(this.baseUrl, this.url, args, {
      pathParam: this.pathVariableBuilder,
      queryParam: this.requestParamBuilder,
    });

    return new Request(urlBuilder.build(), {
      method: this.method,
      headers:
        typeof payload !== "undefined"
          ? { "Content-Type": "application/json" }
          : undefined,
      body:
        typeof payload !== "undefined" ? JSON.stringify(payload) : undefined,
    });
  }

  getMetadata<T>(key: symbol): T | undefined {
    return Reflect.getMetadata(key, this.target, this.propertyKey);
  }
}
