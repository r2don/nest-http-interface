import { describe, expect, test } from 'vitest';
import { CookieValue } from './cookie-value.decorator';
import { type RequestHeaderBuilder } from '../../builders/request-header.builder';
import { REQUEST_HEADER_METADATA } from '../constants';

describe('CookieValue', () => {
  test('should set request header metadata with key', () => {
    // given
    class TestService {
      request(@CookieValue('foo') bar: string): string {
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
    expect(result.metadata).toHaveLength(1);
    expect(result.metadata[0].key).toBe('Cookie');
    expect(result.metadata[0].transform?.('bar')).toBe('foo=bar');
  });
});
