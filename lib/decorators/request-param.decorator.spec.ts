import { describe, test, expect } from 'vitest';
import { REQUEST_PARAM_METADATA } from './constants';
import { RequestParam } from './request-param.decorator';
import { type RequestParamBuilder } from '../builders/request-param.builder';

describe('RequestParam', () => {
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
    expect(result.metadata[0]).toEqual([0, undefined]);
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
    expect(result.metadata[0]).toEqual([1, 'bar']);
  });

  test('should set request param metadata with multiple decorator', () => {
    // given
    class TestService {
      request(
        @RequestParam('foo') foo: string,
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
      [1, undefined],
      [0, 'foo'],
    ]);
  });
});
