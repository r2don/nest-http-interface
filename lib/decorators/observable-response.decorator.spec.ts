import { Observable } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { OBSERVABLE_METADATA } from './constants';
import { ObservableResponse } from './observable-response.decorator';

describe('ObservableResponse', () => {
  test('should set observable response metadata', () => {
    // given
    class TestService {
      @ObservableResponse()
      request(): Observable<string> {
        throw new Error();
      }
    }

    // when
    const result: boolean = Reflect.hasMetadata(
      OBSERVABLE_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result).toBe(true);
  });
});
