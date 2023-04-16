import { describe, it, expect } from "vitest";
import { RequestParamBuilder } from "./request-param.builder";

describe("RequestParamBuilder", () => {
  it("should build query string with explicit key", () => {
    // given
    const builder = new RequestParamBuilder(0, "keyword");
    const args = ["search"];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?keyword=search");
  });

  it("should build query string without key", () => {
    // given
    const builder = new RequestParamBuilder(1);
    const args = ["invalid", { foo: "bar" }];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?foo=bar");
  });

  it("should encode query string", () => {
    // given
    const builder = new RequestParamBuilder(0, "keyword");
    const args = ["?@#$%^&+ "];

    // when
    const actual = builder.build(args);

    // then
    expect(actual).toBe("?keyword=%3F%40%23%24%25%5E%26%2B%20");
  });
});
