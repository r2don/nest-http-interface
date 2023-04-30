import querystring from 'node:querystring';
import { TupleArrayBuilder } from './tuple-array.builder';

export class RequestParamBuilder {
  metadata: Array<
    [
      index: number,
      value: [key: string | undefined, defaultValue: string | undefined],
    ]
  > = [];

  constructor(index: number, key?: string, defaultValue?: string) {
    this.add(index, key, defaultValue);
  }

  add(index: number, key?: string, defaultValue?: string): void {
    this.metadata.push([index, [key, defaultValue]]);
  }

  build(args: any[]): string {
    const result = this.metadata.reduce<Record<string, any>>(
      (acc, [index, [key, defaultValue]]) => {
        if (key != null) {
          acc[key] = String(args[index] ?? defaultValue ?? '');
          return acc;
        }

        TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
          ([key, value]) => {
            acc[key] = String(value);
          },
        );

        return acc;
      },
      {},
    );

    return '?' + querystring.stringify(result);
  }
}
