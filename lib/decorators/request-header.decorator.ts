import { REQUEST_HEADER_METADATA } from "./constants";
import { MetadataMap } from "../types/metadata-map";

export type RequestHeaderMetadata = MetadataMap<number, string>;

export function RequestHeader(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_HEADER_METADATA, target, propertyKey) ??
      new MetadataMap();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_HEADER_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
