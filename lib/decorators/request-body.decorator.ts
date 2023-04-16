import { REQUEST_BODY_METADATA } from "./constants";
import { RequestBodyBuilder } from "../builders/request-body.builder";

export function RequestBody(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: RequestBodyBuilder | undefined = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      target,
      propertyKey
    );

    if (builder != null) {
      builder.add(parameterIndex, key);
      return;
    }

    Reflect.defineMetadata(
      REQUEST_BODY_METADATA,
      new RequestBodyBuilder(parameterIndex, key),
      target,
      propertyKey
    );
  };
}
