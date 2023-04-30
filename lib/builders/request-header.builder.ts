import { TupleArrayBuilder } from './tuple-array.builder';
import { type ParamDecoratorOption } from '../types/param-decorator-option.interface';

export class RequestHeaderBuilder {
  metadata: Array<ParamDecoratorOption<string, string>> = [];

  constructor(option: ParamDecoratorOption<string, string>) {
    this.add(option);
  }

  add(option: ParamDecoratorOption<string, string>): void {
    this.metadata.push(option);
  }

  build(args: any[]): HeadersInit {
    return this.metadata.reduce<Record<string, string>>(
      (acc, { parameterIndex, key, defaultValue, transform }) => {
        if (key != null) {
          const value = String(args[parameterIndex] ?? defaultValue ?? '');
          acc[key] = transform != null ? transform(value) : value;
          return acc;
        }

        TupleArrayBuilder.of<string, unknown>(args[parameterIndex]).forEach(
          ([key, value]) => {
            acc[key] = String(value);
          },
        );

        return acc;
      },
      {},
    );
  }
}
