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

    const searchParams = new URLSearchParams();
    this.metadata.forEach(([index, key]) => {
      if (key != null) {
        searchParams.set(key, args[index]);
        return;
      }

      TupleArrayBuilder.of<string, unknown>(args[index]).forEach(
        ([key, value]) => {
          searchParams.set(key, `${value?.toString() ?? ""}`);
        }
      );
    });

    return "?" + searchParams.toString();
  }
}
