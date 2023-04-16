import { describe, expect, test } from 'vitest';
import { TupleArrayBuilder } from './tuple-array.builder';

describe('TupleArrayBuilder', () => {
  test('should return empty array when value is null', () => {
    // given
    const value = null;

    // when
    const actual = TupleArrayBuilder.of(value);

    // then
    expect(actual).toEqual([]);
  });

  test('should return empty array when value is undefined', () => {
    // given
    const value = undefined;

    // when
    const actual = TupleArrayBuilder.of(value);

    // then
    expect(actual).toEqual([]);
  });

  test('should return empty array when value is not an object', () => {
    // given
    const value = 'string';

    // when
    const actual = TupleArrayBuilder.of(value);

    // then
    expect(actual).toEqual([]);
  });

  test('should return array of tuples when value is an object', () => {
    // given
    const value = { foo: 'bar' };

    // when
    const actual = TupleArrayBuilder.of(value);

    // then
    expect(actual).toEqual([['foo', 'bar']]);
  });

  test('should return array of tuples when value is an object with multiple keys', () => {
    // given
    const value = { foo: 'bar', baz: 'qux' };

    // when
    const actual = TupleArrayBuilder.of(value);

    // then
    expect(actual).toEqual([
      ['foo', 'bar'],
      ['baz', 'qux'],
    ]);
  });
});
