import { describe, test, expect } from 'vitest';
import { CircuitBreaker } from './circuit-breaker.decorator';
import { CIRCUIT_BREAKER_METADATA } from './constants';
import { type CircuitBreakerBuilder } from '../builders/circuit-breaker.builder';

describe('CircuitBreaker', () => {
  test('should set circuit breaker metadata', () => {
    // given
    class TestService {
      @CircuitBreaker({ resetTimeout: 1000 })
      async request(): Promise<string> {
        return '';
      }
    }

    // when
    const result: CircuitBreakerBuilder = Reflect.getMetadata(
      CIRCUIT_BREAKER_METADATA,
      TestService.prototype,
      'request',
    );

    // then
    expect(result.options).toEqual({ resetTimeout: 1000 });
  });
});
