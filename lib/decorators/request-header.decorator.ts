import { REQUEST_HEADER_METADATA } from "./constants";

export type RequestHeaderMetadata = Map<number, string>;

export function RequestHeader(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_HEADER_METADATA, target, propertyKey) ??
      new Map();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_HEADER_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
