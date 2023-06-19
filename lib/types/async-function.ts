import { type Observable } from 'rxjs';

export type AsyncFunction = (
  ...args: any[]
) => Promise<unknown> | Observable<unknown>;
