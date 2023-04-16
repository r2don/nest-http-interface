import { REQUEST_HEADER_METADATA } from "./constants";
import { RequestHeaderBuilder } from "../builders/request-header.builder";

export function RequestHeader(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: RequestHeaderBuilder | undefined = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      target,
      propertyKey
    );

    if (builder != null) {
      builder.add(parameterIndex, key);
      return;
    }

    Reflect.defineMetadata(
      REQUEST_HEADER_METADATA,
      new RequestHeaderBuilder(parameterIndex, key),
      target,
      propertyKey
    );
  };
}
