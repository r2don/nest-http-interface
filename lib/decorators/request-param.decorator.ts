import { REQUEST_PARAM_METADATA } from "./constants";
import { RequestParamBuilder } from "../builders/request-param.builder";

export function RequestParam(key?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const metadata: RequestParamBuilder | undefined = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      target,
      propertyKey
    );

    if (metadata != null) {
      metadata.add(parameterIndex, key);
      return;
    }

    Reflect.defineMetadata(
      REQUEST_PARAM_METADATA,
      new RequestParamBuilder(parameterIndex, key),
      target,
      propertyKey
    );
  };
}
