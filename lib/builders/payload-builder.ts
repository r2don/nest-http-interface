import { TupleArrayBuilder } from "./tuple-array.builder";
import {
  type RequestBodyMetadata,
  type RequestFormMetadata,
} from "../decorators";

export class PayloadBuilder {
  constructor(
    private readonly args: any[],
    private readonly metadata: {
      body?: RequestBodyMetadata;
      form?: RequestFormMetadata;
    } = {}
  ) {}

  contentType(): string | undefined {
    if (this.metadata.form !== undefined) {
      return "application/x-www-form-urlencoded";
    }

    if (this.metadata.body !== undefined) {
      return "application/json";
    }

    return undefined;
  }

  build(): BodyInit | undefined {
    if (this.metadata.form !== undefined) {
      const form = new FormData();
      this.data.forEach(([index, value]) => {
        if (value !== undefined) {
          form.append(value, this.args[index]);
          return;
        }

        TupleArrayBuilder.of<string, string | Blob>(this.args[index]).forEach(
          ([k, v]) => {
            form.append(k, v);
          }
        );
      });

      return form;
    }

    if (this.metadata.body !== undefined) {
      const payload = this.data.reduce(
        (
          acc: Record<string, unknown>,
          [index, value]: [number, string | undefined]
        ) => this.makePayload(acc, index, value),
        {}
      );

      return JSON.stringify(payload);
    }

    return undefined;
  }

  private makePayload(
    acc: Record<string, unknown>,
    index: number,
    value?: string
  ): Record<string, unknown> {
    if (value !== undefined) {
      acc[value] = this.args[index];
      return acc;
    }

    TupleArrayBuilder.of<string, unknown>(this.args[index]).forEach(
      ([k, v]) => {
        acc[k] = v;
      }
    );

    return acc;
  }

  private get data(): Array<[number, string | undefined]> {
    if (this.metadata.form !== undefined) {
      return this.metadata.form.toArray();
    }

    if (this.metadata.body !== undefined) {
      return this.metadata.body.toArray();
    }

    return [];
  }
}
