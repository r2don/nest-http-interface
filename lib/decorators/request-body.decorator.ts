import { REQUEST_BODY_METADATA } from "./constants";
import { MetadataMap } from "../types/metadata-map";

export type RequestBodyMetadata = MetadataMap<number, string | undefined>;

export function RequestBody(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_BODY_METADATA, target, propertyKey) ??
      new MetadataMap();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_BODY_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
