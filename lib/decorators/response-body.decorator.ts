import {
  type ClassConstructor,
  type ClassTransformOptions,
} from 'class-transformer';
import { RESPONSE_BODY_METADATA } from './constants';
import { ResponseBodyBuilder } from '../builders/response-body.builder';

export function ResponseBody<T>(
  cls: ClassConstructor<T>,
  options?: ClassTransformOptions,
): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      RESPONSE_BODY_METADATA,
      new ResponseBodyBuilder(cls, options),
      target,
      propertyKey,
    );
  };
}
