import { type RequestBodyBuilder } from './request-body.builder';
import { type RequestFormBuilder } from './request-form.builder';

export class PayloadBuilder {
  constructor(
    private readonly requestBodyBuilder?: RequestBodyBuilder,
    private readonly requestFormBuilder?: RequestFormBuilder,
  ) {}

  get contentType(): { 'Content-Type': string } | undefined {
    if (this.requestBodyBuilder != null) {
      return { 'Content-Type': 'application/json' };
    }

    if (this.requestFormBuilder != null) {
      return { 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    return undefined;
  }

  build(args: any[]): BodyInit | undefined {
    return (
      this.requestBodyBuilder?.build(args) ??
      this.requestFormBuilder?.build(args)
    );
  }
}
