export class TupleArrayBuilder {
  static of<A, B>(value: unknown): Array<[A, B]> {
    if (value == null) {
      return [];
    }

    if (typeof value === "object") {
      return Object.entries(value) as Array<[A, B]>;
    }

    return [];
  }
}
