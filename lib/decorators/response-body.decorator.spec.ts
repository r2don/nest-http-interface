import { describe, test, expect } from 'vitest';
import { RESPONSE_BODY_METADATA } from './constants';
import { ResponseBody } from './response-body.decorator';
import { type ResponseBodyBuilder } from '../builders/response-body.builder';

describe('ResponseBody', () => {
  test('should set response body metadata', () => {
    // given
    class TestResponse {
      constructor(readonly foo: string) {}
    }
    class TestService {
      @ResponseBody(TestResponse, { version: 1 })
      async request(): Promise<string> {
        return '';
      }
    }

    // when
    const result: ResponseBodyBuilder<unknown> = Reflect.getMetadata(
      RESPONSE_BODY_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.cls).toBe(TestResponse);
    expect(result.options).toEqual({ version: 1 });
  });
});
