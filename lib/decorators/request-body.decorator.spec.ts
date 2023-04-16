import { describe, test, expect } from 'vitest';
import { REQUEST_BODY_METADATA } from './constants';
import { RequestBody } from './request-body.decorator';
import { type RequestBodyBuilder } from '../builders/request-body.builder';
import { type RequestParamBuilder } from '../builders/request-param.builder';

describe('RequestBody', () => {
  test('should not create request body metadata when not on method', () => {
    // given
    class TestService {
      constructor(@RequestBody() foo: string) {
        return foo;
      }
    }

    // when
    const result = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBeUndefined();
  });

  test('should set request body metadata with empty key', () => {
    // given
    class TestService {
      request(@RequestBody() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestBodyBuilder = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, undefined]]);
  });

  test('should set request body metadata with key', () => {
    // given
    class TestService {
      request(@RequestBody('foo') bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestBodyBuilder = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, 'foo']]);
  });

  test('should set request body metadata with multiple decorator', () => {
    // given
    class TestService {
      request(
        @RequestBody('foo') foo: string,
        @RequestBody() bar: { bar: string },
      ): string {
        return foo;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([
      [1, undefined],
      [0, 'foo'],
    ]);
  });
});
