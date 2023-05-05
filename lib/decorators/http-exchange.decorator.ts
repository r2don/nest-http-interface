import { HTTP_EXCHANGE_METADATA } from './constants';
import { HttpRequestBuilder } from '../builders/http-request.builder';
import {
  type AsyncFunction,
  type HttpClientOptions,
  type HttpMethod,
} from '../types';

export const HttpExchange =
  (method: HttpMethod, url: string, options?: HttpClientOptions) =>
  <P extends string>(target: Record<P, AsyncFunction>, propertyKey: P) => {
    Reflect.defineMetadata(
      HTTP_EXCHANGE_METADATA,
      new HttpRequestBuilder(
        target,
        propertyKey,
        method,
        url,
        undefined,
        options,
      ),
      target,
      propertyKey,
    );
  };

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const GetExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('GET', url, options);
export const PostExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('POST', url, options);
export const PutExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('PUT', url, options);
export const DeleteExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('DELETE', url, options);
export const PatchExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('PATCH', url, options);
export const HeadExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('HEAD', url, options);
export const OptionsExchange = (url = '', options?: HttpClientOptions) =>
  HttpExchange('OPTIONS', url, options);
