import { describe, test, expect } from 'vitest';
import { PATH_VARIABLE_METADATA } from './constants';
import { PathVariable } from './path-variable.decorator';
import { type PathVariableBuilder } from '../builders/path-variable.builder';

describe('PathVariable', () => {
  test('should not create path variable metadata when not on method', () => {
    // given
    class TestService {
      foo: string;
      constructor(@PathVariable('foo') foo: string) {
        this.foo = foo;
      }
    }

    // when
    const result = Reflect.getMetadata(
      PATH_VARIABLE_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBeUndefined();
  });

  test('should set path variable metadata', () => {
    // given
    class TestService {
      request(
        @PathVariable('foo') foo: string,
        @PathVariable('bar') bar: string,
      ): string {
        return foo + bar;
      }
    }

    // when
    const result: PathVariableBuilder = Reflect.getMetadata(
      PATH_VARIABLE_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.metadata).toEqual([
      [1, 'bar'],
      [0, 'foo'],
    ]);
  });
});
