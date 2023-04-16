import { describe, test, expect } from 'vitest';
import { RequestHeaderBuilder } from './request-header.builder';

describe('RequestHeaderBuilder', () => {
  test('should build header with explicit key', () => {
    // given
    const builder = new RequestHeaderBuilder(0, 'keyword');
    const args = ['search'];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ keyword: 'search' });
  });

  test('should build header without key', () => {
    // given
    const builder = new RequestHeaderBuilder(1);
    const args = ['invalid', { foo: 'bar' }];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toEqual({ foo: 'bar' });
  });
});
