import { describe, test, expect } from 'vitest';
import { imitation } from './imitation';

describe('imitation', () => {
  test('should throw error', () => {
    // given
    const args = [1, 2, 3];

    // when
    const result = (): string => {
      return imitation(...args);
    };

    // then
    expect(result).toThrowError('Not implemented');
  });
});
