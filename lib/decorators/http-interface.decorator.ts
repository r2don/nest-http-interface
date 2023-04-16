import { applyDecorators, Injectable } from '@nestjs/common';
import { HTTP_INTERFACE_METADATA } from './constants';

export function HttpInterface(url = ''): ClassDecorator {
  const decorator: ClassDecorator = (target) => {
    Reflect.defineMetadata(HTTP_INTERFACE_METADATA, url, target.prototype);
  };

  return applyDecorators(Injectable, decorator);
}
