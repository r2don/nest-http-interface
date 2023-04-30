import { REQUEST_PARAM_METADATA } from './constants';
import { RequestParamBuilder } from '../builders/request-param.builder';

export function RequestParam(key?: string): ParameterDecorator;
export function RequestParam(
  key: string,
  defaultValue?: string,
): ParameterDecorator;
export function RequestParam(
  key?: string,
  defaultValue?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: RequestParamBuilder | undefined = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      target,
      propertyKey,
    );

    if (builder != null) {
      builder.add(parameterIndex, key, defaultValue);
      return;
    }

    Reflect.defineMetadata(
      REQUEST_PARAM_METADATA,
      new RequestParamBuilder(parameterIndex, key, defaultValue),
      target,
      propertyKey,
    );
  };
}
