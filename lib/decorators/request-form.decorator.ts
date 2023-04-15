import { REQUEST_FORM_METADATA } from "./constants";
import { MetadataMap } from "../types/metadata-map";

export type RequestFromMetadata = MetadataMap<number, string | undefined>;

export function RequestForm(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_FORM_METADATA, target, propertyKey) ??
      new MetadataMap();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_FORM_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
