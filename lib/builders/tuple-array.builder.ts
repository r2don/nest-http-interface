export class TupleArrayBuilder {
  static of<A, B>(value: unknown): Array<[A, B]> {
    if (value === undefined) {
      return [];
    }

    if (value instanceof Map) {
      return [...value.entries()];
    }

    if (typeof value === "object" && value !== null) {
      return Object.entries(value) as Array<[A, B]>;
    }

    return [];
  }
}
