import { describe, test, expect } from 'vitest';
import { RequestFormBuilder } from './request-form.builder';

describe('RequestFormBuilder', () => {
  test('should build form data with explicit key', () => {
    // given
    const builder = new RequestFormBuilder(0, 'keyword');
    const args = ['search'];

    // when
    const actual = builder.build(args);

    // then
    expect([...actual.entries()]).toEqual([['keyword', 'search']]);
  });

  test('should ignore null value in args', () => {
    // given
    const builder = new RequestFormBuilder(0, 'keyword');
    const args = [null];

    // when
    const actual = builder.build(args);

    // then
    expect([...actual.entries()]).toEqual([['keyword', '']]);
  });

  test('should build form data with explicit key and default', () => {
    // given
    const builder = new RequestFormBuilder(0, 'keyword', 'search');
    const args = [null];

    // when
    const actual = builder.build(args);

    // then
    expect([...actual.entries()]).toEqual([['keyword', 'search']]);
  });

  test('should build form data without key', () => {
    // given
    const builder = new RequestFormBuilder(1);
    const args = ['invalid', { foo: 'bar' }];

    // when
    const actual = builder.build(args);

    // then
    expect([...actual.entries()]).toEqual([['foo', 'bar']]);
  });
});
