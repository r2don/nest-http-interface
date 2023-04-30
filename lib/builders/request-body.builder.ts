import { TupleArrayBuilder } from './tuple-array.builder';

export class RequestBodyBuilder {
  metadata: Array<
    [index: number, value: [key: string | undefined, defaultValue: unknown]]
  > = [];

  constructor(index: number, key?: string, defaultValue?: unknown) {
    this.add(index, key, defaultValue);
  }

  add(index: number, key?: string, defaultValue?: unknown): void {
    this.metadata.push([index, [key, defaultValue]]);
  }

  build(args: any[], gqlQuery?: string): string {
    const result = this.metadata.reduce<Record<string, any>>(
      (acc, [index, [key, defaultValue]]) => {
        if (key != null) {
          acc[key] = args[index] ?? defaultValue;
          return acc;
        }

        TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
          ([key, value]) => {
            acc[key] = value;
          },
        );

        return acc;
      },
      {},
    );

    return JSON.stringify(
      gqlQuery != null ? { query: gqlQuery, variables: result } : result,
    );
  }
}
