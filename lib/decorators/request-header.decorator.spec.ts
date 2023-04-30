import { describe, test, expect } from 'vitest';
import { REQUEST_HEADER_METADATA } from './constants';
import { RequestHeader } from './request-header.decorator';
import { type RequestHeaderBuilder } from '../builders/request-header.builder';
import { type RequestParamBuilder } from '../builders/request-param.builder';

describe('RequestHeader', () => {
  test('should not create request header metadata when not on method', () => {
    // given
    class TestService {
      constructor(@RequestHeader() foo: string) {
        return foo;
      }
    }

    // when
    const result = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBeUndefined();
  });

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
    expect(result.metadata).toMatchInlineSnapshot(`
      [
        {
          "key": undefined,
          "parameterIndex": 0,
        },
      ]
    `);
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
    expect(result.metadata).toMatchInlineSnapshot(`
      [
        {
          "key": "foo",
          "parameterIndex": 0,
        },
      ]
    `);
  });

  test('should set request header metadata with multiple decorator', () => {
    // given
    class TestService {
      request(
        @RequestHeader('foo', { defaultValue: 'default' }) foo: string,
        @RequestHeader() bar: { bar: string },
      ): string {
        return foo;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toMatchInlineSnapshot(`
      [
        {
          "key": undefined,
          "parameterIndex": 1,
        },
        {
          "defaultValue": "default",
          "key": "foo",
          "parameterIndex": 0,
        },
      ]
    `);
  });
});
