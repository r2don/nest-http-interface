import { REQUEST_FORM_METADATA } from "./constants";

export type RequestFromMetadata = Map<number, string | undefined>;

export function RequestForm(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata =
      Reflect.getMetadata(REQUEST_FORM_METADATA, target, propertyKey) ??
      new Map();

    metadata.set(parameterIndex, key);

    Reflect.defineMetadata(
      REQUEST_FORM_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
