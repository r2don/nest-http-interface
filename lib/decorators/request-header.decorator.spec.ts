import { describe, test, expect } from 'vitest';
import { REQUEST_HEADER_METADATA } from './constants';
import { RequestHeader } from './request-header.decorator';
import { type RequestHeaderBuilder } from '../builders/request-header.builder';

describe('RequestHeader', () => {
  test('should set request header metadata with empty key', () => {
    // given
    class TestService {
      request(@RequestHeader() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestHeaderBuilder = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, undefined]]);
  });

  test('should set request header metadata with key', () => {
    // given
    class TestService {
      request(@RequestHeader('foo') bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestHeaderBuilder = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, 'foo']]);
  });
});
