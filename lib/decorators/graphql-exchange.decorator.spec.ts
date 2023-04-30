import { describe, test, expect } from 'vitest';
import { HTTP_EXCHANGE_METADATA } from './constants';
import { GraphQLExchange } from './graphql-exchange.decorator';
import { type HttpRequestBuilder } from '../builders/http-request.builder';

describe('GraphQLExchange', () => {
  test('should set graphql exchange metadata', () => {
    // given
    class TestService {
      @GraphQLExchange(`query { hello }`, '/api/graphql')
      async request(): Promise<string> {
        return '';
      }
    }

    // when
    const result: HttpRequestBuilder = Reflect.getMetadata(
      HTTP_EXCHANGE_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.target).toBe(TestService.prototype);
    expect(result.propertyKey).toBe('request');
    expect(result.method).toBe('POST');
    expect(result.url).toBe('/api/graphql');
    expect(result.gqlQuery).toBe(`query { hello }`);
  });
});
