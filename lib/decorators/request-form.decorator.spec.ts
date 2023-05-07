import { describe, test, expect } from 'vitest';
import { REQUEST_FORM_METADATA } from './constants';
import { RequestForm } from './request-form.decorator';
import { type RequestFormBuilder } from '../builders/request-form.builder';
import { type RequestParamBuilder } from '../builders/request-param.builder';

describe('RequestForm', () => {
  test('should not create request form metadata when not on method', () => {
    // given
    class TestService {
      foo: string;
      constructor(@RequestForm() foo: string) {
        this.foo = foo;
      }
    }

    // when
    const result = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBeUndefined();
  });

  test('should set request form metadata with empty key', () => {
    // given
    class TestService {
      request(@RequestForm() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestFormBuilder = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, [undefined, undefined]]]);
  });

  test('should set request form metadata with key', () => {
    // given
    class TestService {
      request(@RequestForm('foo') bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestFormBuilder = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([[0, ['foo', undefined]]]);
  });

  test('should set request form metadata with multiple decorator', () => {
    // given
    class TestService {
      request(
        @RequestForm('foo', 'default') foo: string,
        @RequestForm() bar: { bar: string },
      ): string {
        return foo;
      }
    }

    // when
    const result: RequestParamBuilder = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
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
