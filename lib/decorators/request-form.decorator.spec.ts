import { describe, test, expect } from "vitest";
import { REQUEST_FORM_METADATA } from "./constants";
import {
  RequestForm,
  type RequestFormMetadata,
} from "./request-form.decorator";

describe("RequestForm", () => {
  test("should set request form metadata with empty key", () => {
    // given
    class TestService {
      request(@RequestForm() query: { foo: string }): string {
        return query.foo;
      }
    }

    // when
    const result: RequestFormMetadata = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBeUndefined();
  });

  test("should set request form metadata with key", () => {
    // given
    class TestService {
      request(@RequestForm("foo") bar: string): string {
        return bar;
      }
    }

    // when
    const result: RequestFormMetadata = Reflect.getMetadata(
      REQUEST_FORM_METADATA,
      TestService.prototype,
      "request"
    );

    // then
    expect(result).toHaveLength(1);
    expect(result.get(0)).toBe("foo");
  });
});
