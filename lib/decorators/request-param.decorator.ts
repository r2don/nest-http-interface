import { REQUEST_PARAM_METADATA } from "./constants";

export type RequestParamMetadata = Map<number, string | undefined>;

export function RequestParam(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_PARAM_METADATA, target, propertyKey) ??
      new Map();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_PARAM_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
