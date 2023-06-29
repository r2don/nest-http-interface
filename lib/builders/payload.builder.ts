import { type RequestBodyBuilder } from './request-body.builder';
import { type RequestFormBuilder } from './request-form.builder';

export class PayloadBuilder {
  constructor(
    private readonly requestBodyBuilder?: RequestBodyBuilder,
    private readonly requestFormBuilder?: RequestFormBuilder,
    private readonly gqlQuery?: string,
  ) {}

  get contentType(): { 'Content-Type': string } | undefined {
    if (this.gqlQuery != null || this.requestBodyBuilder != null) {
      return { 'Content-Type': 'application/json' };
    }

    return undefined;
  }

  build(args: any[]): BodyInit | undefined {
    if (this.gqlQuery != null && this.requestBodyBuilder == null) {
      return JSON.stringify({ query: this.gqlQuery });
    }

    return (
      this.requestBodyBuilder?.build(args, this.gqlQuery) ??
      this.requestFormBuilder?.build(args)
    );
  }
}
