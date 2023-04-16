import { TupleArrayBuilder } from "../builders/tuple-array.builder";

export class MetadataMap<K, V> extends Map<K, V> {
  toArray(): Array<[K, V]> {
    return TupleArrayBuilder.of(this);
  }
}
