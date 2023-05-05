import { HTTP_EXCHANGE_METADATA } from './constants';
import { HttpRequestBuilder } from '../builders/http-request.builder';
import { type AsyncFunction, type HttpClientOptions } from '../types';

export function GraphQLExchange(
  query: string,
  url = '/graphql',
  options?: HttpClientOptions,
) {
  return <P extends string>(
    target: Record<P, AsyncFunction>,
    propertyKey: P,
  ) => {
    Reflect.defineMetadata(
      HTTP_EXCHANGE_METADATA,
      HttpRequestBuilder.forGraphQL(target, propertyKey, query, options, url),
      target,
      propertyKey,
    );
  };
}
