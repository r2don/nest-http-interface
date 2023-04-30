import { describe, expect, test } from 'vitest';
import { Bearer } from './bearer.decorator';
import { type RequestHeaderBuilder } from '../../builders/request-header.builder';
import { REQUEST_HEADER_METADATA } from '../constants';

describe('Bearer', () => {
  test('should set request header metadata with key', () => {
    // given
    class TestService {
      request(@Bearer() token: string): string {
        return token;
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
    expect(result.metadata[0].key).toBe('Authorization');
    expect(result.metadata[0].transform?.('token')).toBe('Bearer token');
  });
});
