import { describe, test, expect } from 'vitest';
import { REQUEST_PARAM_METADATA } from './constants';
import { RequestParam } from './request-param.decorator';
import { type RequestParamBuilder } from '../builders/request-param.builder';

describe('RequestParam', () => {
  test('should not create request param metadata when not on method', () => {
    // given
    class TestService {
      foo: string;
      constructor(@RequestParam() foo: string) {
        this.foo = foo;
      }
    }

    // when
    const result = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBeUndefined();
  });

  test('should set request param metadata with empty key', () => {
    // given
    class TestService {
      request(@RequestParam() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toHaveLength(1);
    expect(result.metadata[0]).toEqual([0, [undefined, undefined]]);
  });

  test('should set request param metadata with key', () => {
    // given
    class TestService {
      request(_foo: string, @RequestParam('bar') bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toHaveLength(1);
    expect(result.metadata[0]).toEqual([1, ['bar', undefined]]);
  });

  test('should set request param metadata with multiple decorator', () => {
    // given
    class TestService {
      request(
        @RequestParam('foo', 'default') foo: string,
        @RequestParam() bar: { bar: string },
      ): string {
        return foo;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_PARAM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([
      [1, [undefined, undefined]],
      [0, ['foo', 'default']],
    ]);
  });
});
