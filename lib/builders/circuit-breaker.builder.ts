import CircuitBreaker from 'opossum';

export class CircuitBreakerBuilder {
  constructor(private readonly options?: CircuitBreaker.Options) {}

  async build(executor: () => Promise<Response>): Promise<Response> {
    if (this.options == null) {
      return await executor();
    }

    return await new CircuitBreaker(executor, this.options).fire();
  }
}
