import { describe, test, expect } from 'vitest';
import { CircuitBreakerBuilder } from './circuit-breaker.builder';

describe('CircuitBreakerBuilder', () => {
  test('should not apply circuit breaker if option is not given', async () => {
    // given
    let executeCount = 0;
    const executor = async (): Promise<Response> => {
      executeCount++;
      throw new Error('error');
    };
    const request = new CircuitBreakerBuilder().build(executor);

    // when
    for (let i = 0; i < 10; i++) {
      await request().catch(() => 0);
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    // then
    expect(executeCount).toBe(10);
  });

  test('should apply circuit breaker if option is given', async () => {
    // given
    let executeCount = 0;
    const executor = async (): Promise<Response> => {
      executeCount++;
      throw new Error('error');
    };
    const request = new CircuitBreakerBuilder({
      errorThresholdPercentage: 50,
      resetTimeout: 1000,
    }).build(executor);

    // when
    for (let i = 0; i < 10; i++) {
      await request().catch(() => 0);
      await new Promise((resolve) => setTimeout(resolve, 5));
    }

    // then
    expect(executeCount).toBe(1);
  });
});
