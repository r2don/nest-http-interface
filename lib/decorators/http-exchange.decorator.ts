import { HTTP_EXCHANGE_METADATA } from "./constants";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export interface HttpExchangeMetadata {
  method: HttpMethod;
  url: string;
}

type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

export function HttpExchange(method: HttpMethod, url: string) {
  return function <P extends string>(
    target: Record<P, AsyncFunction>,
    propertyKey: P
  ) {
    Reflect.defineMetadata(
      HTTP_EXCHANGE_METADATA,
      { method, url },
      target,
      propertyKey
    );
  };
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const GetExchange = (url = "") => HttpExchange("GET", url);
export const PostExchange = (url = "") => HttpExchange("POST", url);
export const PutExchange = (url = "") => HttpExchange("PUT", url);
export const DeleteExchange = (url = "") => HttpExchange("DELETE", url);
export const PatchExchange = (url = "") => HttpExchange("PATCH", url);
export const HeadExchange = (url = "") => HttpExchange("HEAD", url);
export const OptionsExchange = (url = "") => HttpExchange("OPTIONS", url);
