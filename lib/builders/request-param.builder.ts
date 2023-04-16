import querystring from "node:querystring";
import { TupleArrayBuilder } from "./tuple-array.builder";

export class RequestParamBuilder {
  metadata: Array<[index: number, key: string | undefined]> = [];

  constructor(index: number, key?: string) {
    this.metadata.push([index, key]);
  }

  get length(): number {
    return this.metadata.length;
  }

  add(index: number, key?: string): void {
    this.metadata.push([index, key]);
  }

  build(args: any[]): string {
    if (this.metadata.length === 0) {
      return "";
    }

    const result = this.metadata.reduce<Record<string, any>>(
      (acc, [index, key]) => {
        if (key != null) {
          acc[key] = args[index];
          return acc;
        }

        TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
          ([key, value]) => {
            acc[key] = value;
          }
        );

        return acc;
      },
      {}
    );

    return "?" + querystring.stringify(result);
  }
}
