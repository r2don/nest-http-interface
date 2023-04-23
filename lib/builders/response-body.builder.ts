import {
  type ClassConstructor,
  type ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

export class ResponseBodyBuilder<T> {
  constructor(
    readonly cls: ClassConstructor<T>,
    readonly options?: ClassTransformOptions,
  ) {}

  build(plain: Record<string, unknown>): T {
    return plainToInstance(this.cls, plain, this.options);
  }
}
