import { describe, test, expect } from "vitest";
import { REQUEST_BODY_METADATA } from "./constants";
import {
  RequestBody,
  type RequestBodyMetadata,
} from "./request-body.decorator";

describe("RequestBody", () => {
  test("should set request body metadata with empty key", () => {
    // given
    class TestService {
      request(@RequestBody() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestBodyMetadata = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBeUndefined();
  });

  test("should set request body metadata with key", () => {
    // given
    class TestService {
      request(@RequestBody("foo") bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestBodyMetadata = Reflect.getMetadata(
      REQUEST_BODY_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBe("foo");
  });
});
