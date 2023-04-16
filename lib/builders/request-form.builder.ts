import { TupleArrayBuilder } from "./tuple-array.builder";

export class RequestFormBuilder {
  metadata: Array<[index: number, key: string | undefined]> = [];

  constructor(index: number, key?: string) {
    this.add(index, key);
  }

  add(index: number, key?: string): void {
    this.metadata.push([index, key]);
  }

  build(args: any[]): FormData {
    const form = new FormData();

    this.metadata.forEach(([index, key]) => {
      if (key != null) {
        form.append(key, args[index]);
        return;
      }

      TupleArrayBuilder.of<string, any>(args[index]).forEach(([key, value]) => {
        form.append(key, value);
      });
    });

    return form;
  }
}
