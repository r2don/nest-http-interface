import { TupleArrayBuilder } from "./tuple-array-builder";
import {
  type PathVariableMetadata,
  type RequestParamMetadata,
} from "../decorators";

export class URLBuilder {
  #pathParams: Array<[number, string]> = [];
  #queryParams: Array<[number, string | undefined]> = [];

  constructor(
    private readonly host: string,
    private readonly path: string,
    private readonly args: any[],
    metadata: {
      pathParam?: PathVariableMetadata;
      queryParam?: RequestParamMetadata;
    } = {}
  ) {
    if (this.host.length === 0) {
      this.host = this.path;
      this.path = "";
    }
    this.#pathParams = metadata.pathParam?.toArray() ?? [];
    this.#queryParams = metadata.queryParam?.toArray() ?? [];
  }

  build(): string {
    return this.replacePathVariable() + this.appendQueryParams();
  }

  private replacePathVariable(): string {
    return this.#pathParams.reduce(
      (url, [index, value]) =>
        url.replace(new RegExp(`{${value}}`, "g"), this.args[index]),
      this.url
    );
  }

  private appendQueryParams(): string {
    if (this.#queryParams.length === 0) {
      return "";
    }

    const searchParams = new URLSearchParams();
    this.#queryParams.forEach(([paramIndex, queryParamKey]) => {
      if (typeof queryParamKey !== "undefined") {
        searchParams.set(queryParamKey, this.args[paramIndex]);
        return;
      }

      TupleArrayBuilder.of<string, unknown>(this.args[paramIndex]).forEach(
        ([key, value]) => {
          searchParams.set(key, `${value?.toString() ?? ""}`);
        }
      );
    });

    return "?" + searchParams.toString();
  }

  get url(): string {
    if (this.path === "") {
      return this.host;
    }

    if (this.isStartWithProtocol()) {
      const [protocol, host] = this.host.split("://");

      return protocol + "://" + this.replaceSlash(`${host}/${this.path}`);
    }

    return this.replaceSlash(`${this.host}/${this.path}`);
  }

  private isStartWithProtocol(): boolean {
    return this.host.match(/^https?:\/\//) != null;
  }

  private replaceSlash(url: string): string {
    return url.replace(/\/{2,}/g, "/");
  }
}
