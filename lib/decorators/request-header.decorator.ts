import { REQUEST_HEADER_METADATA } from './constants';
import { RequestHeaderBuilder } from '../builders/request-header.builder';

export function RequestHeader(key?: string): ParameterDecorator;
export function RequestHeader(
  key: string,
  option?: { defaultValue?: string; transform?: (value: string) => string },
): ParameterDecorator;
export function RequestHeader(
  key?: string,
  option?: { defaultValue?: string; transform?: (value: string) => string },
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: RequestHeaderBuilder | undefined = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      target,
      propertyKey,
    );

    if (builder != null) {
      builder.add({ parameterIndex, key, ...option });
      return;
    }

    Reflect.defineMetadata(
      REQUEST_HEADER_METADATA,
      new RequestHeaderBuilder({ parameterIndex, key, ...option }),
      target,
      propertyKey,
    );
  };
}
