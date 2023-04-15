import { REQUEST_PARAM_METADATA } from "./constants";
import { MetadataMap } from "../types/metadata-map";

export type RequestParamMetadata = MetadataMap<number, string | undefined>;

export function RequestParam(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_PARAM_METADATA, target, propertyKey) ??
      new MetadataMap();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_PARAM_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
