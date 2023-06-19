import { Observable } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { OBSERVABLE_METADATA } from './constants';
import { ObservableResponse } from './observable-response.decorator';
import { imitation } from '../supports';

describe('ObservableResponse', () => {
  test('should set observable response metadata', () => {
    // given
    class TestService {
      @ObservableResponse()
      request(): Observable<string> {
        return imitation();
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
