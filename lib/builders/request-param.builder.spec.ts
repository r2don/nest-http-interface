import { describe, test, expect } from "vitest";
import { RequestParamBuilder } from "./request-param.builder";

describe("RequestParamBuilder", () => {
  test("should build query string with explicit key", () => {
    // given
    const builder = new RequestParamBuilder(0, "keyword");
    const args = ["search"];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?keyword=search");
  });

  test("should build query string without key", () => {
    // given
    const builder = new RequestParamBuilder(1);
    const args = ["invalid", { foo: "bar" }];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?foo=bar");
  });

  test("should encode query string", () => {
    // given
    const builder = new RequestParamBuilder(0, "keyword");
    const args = ["?@#$%^&+ "];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?keyword=%3F%40%23%24%25%5E%26%2B%20");
  });
});
