import { TupleArrayBuilder } from './tuple-array.builder';

export class RequestHeaderBuilder {
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

  build(args: any[]): HeadersInit {
    return this.metadata.reduce<Record<string, string>>(
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
  }
}
