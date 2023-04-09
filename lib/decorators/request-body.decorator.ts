import { REQUEST_BODY_METADATA } from "./constants";

export type RequestBodyMetadata = Map<number, string | undefined>;

export function RequestBody(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_BODY_METADATA, target, propertyKey) ??
      new Map();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_BODY_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
