import { TupleArrayBuilder } from './tuple-array.builder';

export class RequestHeaderBuilder {
  metadata: Array<[index: number, key: string | undefined]> = [];

  constructor(index: number, key?: string) {
    this.add(index, key);
  }

  add(index: number, key?: string): void {
    this.metadata.push([index, key]);
  }

  build(args: any[]): HeadersInit {
    return this.metadata.reduce<Record<string, string>>((acc, [index, key]) => {
      if (key != null) {
        acc[key] = String(args[index]);
        return acc;
      }

      TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
        ([key, value]) => {
          acc[key] = String(value);
        },
      );

      return acc;
    }, {});
  }
}
