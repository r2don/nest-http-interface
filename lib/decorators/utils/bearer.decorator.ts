import { RequestHeader } from '../request-header.decorator';

export function Bearer(): ParameterDecorator {
  return RequestHeader('Authorization', {
    transform: (value) => `Bearer ${value}`,
  });
}
