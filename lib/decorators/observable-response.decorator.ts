import { OBSERVABLE_METADATA } from './constants';

export function ObservableResponse(): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(OBSERVABLE_METADATA, true, target, propertyKey);
  };
}
