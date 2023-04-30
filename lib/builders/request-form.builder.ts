import { TupleArrayBuilder } from './tuple-array.builder';

export class RequestFormBuilder {
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

  build(args: any[]): FormData {
    const form = new FormData();

    this.metadata.forEach(([index, [key, defaultValue]]) => {
      if (key != null) {
        form.append(key, String(args[index] ?? defaultValue ?? ''));
        return;
      }

      TupleArrayBuilder.of<string, any>(args[index]).forEach(([key, value]) => {
        form.append(key, String(value));
      });
    });

    return form;
  }
}
