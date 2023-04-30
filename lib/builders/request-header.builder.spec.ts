import { describe, test, expect } from 'vitest';
import { RequestHeaderBuilder } from './request-header.builder';

describe('RequestHeaderBuilder', () => {
  test('should build header with explicit key', () => {
    // given
    const builder = new RequestHeaderBuilder({
      parameterIndex: 0,
      key: 'keyword',
    });
    const args = ['search'];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ keyword: 'search' });
  });

  test('should ignore null value in args', () => {
    // given
    const builder = new RequestHeaderBuilder({
      parameterIndex: 0,
      key: 'keyword',
    });
    const args = [null];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ keyword: '' });
  });

  test('should build header with explicit key and default', () => {
    // given
    const builder = new RequestHeaderBuilder({
      parameterIndex: 0,
      key: 'keyword',
      defaultValue: 'search',
    });
    const args = [null];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ keyword: 'search' });
  });

  test('should build header without key', () => {
    // given
    const builder = new RequestHeaderBuilder({
      parameterIndex: 1,
    });
    const args = ['invalid', { foo: 'bar' }];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ foo: 'bar' });
  });

  test('should apply transform function to args', () => {
    // given
    const builder = new RequestHeaderBuilder({
      parameterIndex: 0,
      key: 'keyword',
      transform: (value) => value.toUpperCase(),
    });
    const args = ['search'];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ keyword: 'SEARCH' });
  });
});
