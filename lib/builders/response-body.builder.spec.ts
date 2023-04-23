import { describe, test, expect } from 'vitest';
import { ResponseBodyBuilder } from './response-body.builder';

describe('ResponseBodyBuilder', () => {
  test('should build response body', () => {
    // given
    class TestResponse {
      constructor(public value: string) {}
    }
    const builder = new ResponseBodyBuilder(TestResponse);

    // when
    const result: TestResponse = builder.build({ value: 'test' });

    // then
    expect(result).toBeInstanceOf(TestResponse);
    expect(result.value).toBe('test');
  });
});
