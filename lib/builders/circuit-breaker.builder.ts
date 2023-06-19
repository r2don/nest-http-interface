import CircuitBreaker from 'opossum';

export class CircuitBreakerBuilder {
  constructor(readonly options?: CircuitBreaker.Options) {}

  build(
    executor: (...args: any[]) => Promise<any>,
  ): (...args: any[]) => Promise<any> {
    if (this.options == null) {
      return executor;
    }

    const circuitBreaker = new CircuitBreaker(executor, this.options);

    return async (...args) => {
      return await circuitBreaker.fire(...args);
    };
  }
}
