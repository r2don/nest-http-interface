import { REQUEST_FORM_METADATA } from './constants';
import { RequestFormBuilder } from '../builders/request-form.builder';

export function RequestForm(key?: string): ParameterDecorator;
export function RequestForm(
  key: string,
  defaultValue?: string,
): ParameterDecorator;
export function RequestForm(
  key?: string,
  defaultValue?: string,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: RequestFormBuilder | undefined = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      target,
      propertyKey,
    );

    if (builder != null) {
      builder.add(parameterIndex, key, defaultValue);
      return;
    }

    Reflect.defineMetadata(
      REQUEST_FORM_METADATA,
      new RequestFormBuilder(parameterIndex, key, defaultValue),
      target,
      propertyKey,
    );
  };
}
