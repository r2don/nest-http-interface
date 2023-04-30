import { RequestHeader } from '../request-header.decorator';

export function CookieValue(key: string): ParameterDecorator {
  return RequestHeader('Cookie', {
    transform: (value) => `${key}=${value}`,
  });
}
