import { HTTP_EXCHANGE_METADATA } from './constants';
import { HttpRequestBuilder } from '../builders/http-request.builder';
import { type AsyncFunction } from '../types';

export function GraphQLExchange(query: string, url = '/graphql') {
  return <P extends string>(
    target: Record<P, AsyncFunction>,
    propertyKey: P,
  ) => {
    Reflect.defineMetadata(
      HTTP_EXCHANGE_METADATA,
      new HttpRequestBuilder(target, propertyKey, 'POST', url, query),
      target,
      propertyKey,
    );
  };
}
