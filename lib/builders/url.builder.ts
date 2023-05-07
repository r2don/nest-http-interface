import { type PathVariableBuilder } from './path-variable.builder';
import { type RequestParamBuilder } from './request-param.builder';

export class UrlBuilder {
  constructor(
    private readonly host: string,
    private readonly path: string,
    private readonly args: any[],
    private readonly pathVariableBuilder?: PathVariableBuilder,
    private readonly requestParamBuilder?: RequestParamBuilder,
  ) {
    if (this.host === '') {
      this.host = this.path;
      this.path = '';
    }
  }

  build(): string {
    return (
      (this.pathVariableBuilder?.build(this.url, this.args) ?? this.url) +
      (this.requestParamBuilder?.build(this.args) ?? '')
    );
  }

  get url(): string {
    if (this.path === '') {
      return this.host;
    }

    if (this.isStartWithProtocol()) {
      const [protocol, host] = this.host.split('://');

      return protocol + '://' + this.replaceSlash(`${host}/${this.path}`);
    }

    return this.replaceSlash(`${this.host}/${this.path}`);
  }

  private isStartWithProtocol(): boolean {
    return /^https?:\/\//.exec(this.host) != null;
  }

  private replaceSlash(url: string): string {
    return url.replace(/\/{2,}/g, '/');
  }
}
