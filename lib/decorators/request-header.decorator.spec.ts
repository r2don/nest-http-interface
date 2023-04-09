import { describe, test, expect } from "vitest";
import { REQUEST_HEADER_METADATA } from "./constants";
import {
  RequestHeader,
  type RequestHeaderMetadata,
} from "./request-header.decorator";

describe("RequestHeader", () => {
  test("should set request header metadata with empty key", () => {
    // given
    class TestService {
      request(@RequestHeader() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestHeaderMetadata = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBeUndefined();
  });

  test("should set request header metadata with key", () => {
    // given
    class TestService {
      request(@RequestHeader("foo") bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestHeaderMetadata = Reflect.getMetadata(
      REQUEST_HEADER_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBe("foo");
  });
});
