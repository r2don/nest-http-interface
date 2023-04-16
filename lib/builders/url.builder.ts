import { type RequestParamBuilder } from "./request-param.builder";
import { type PathVariableMetadata } from "../decorators";

export class UrlBuilder {
  #pathParams: Array<[number, string]> = [];
  #requestParamBuilder: RequestParamBuilder | undefined;

  constructor(
    private readonly host: string,
    private readonly path: string,
    private readonly args: any[],
    metadata: {
      pathParam?: PathVariableMetadata;
      queryParam?: RequestParamBuilder;
    } = {}
  ) {
    if (this.host.length === 0) {
      this.host = this.path;
      this.path = "";
    }
    this.#pathParams = metadata.pathParam?.toArray() ?? [];
    this.#requestParamBuilder = metadata.queryParam;
  }

  build(): string {
    return (
      this.replacePathVariable() +
      (this.#requestParamBuilder?.build(this.args) ?? "")
    );
  }

  private replacePathVariable(): string {
    return this.#pathParams.reduce(
      (url, [index, value]) =>
        url.replace(new RegExp(`{${value}}`, "g"), this.args[index]),
      this.url
    );
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
