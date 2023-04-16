import { describe, test, expect } from "vitest";
import { PathVariableBuilder } from "./path-variable.builder";
import { RequestParamBuilder } from "./request-param.builder";
import { UrlBuilder } from "./url.builder";

describe("UrlBuilder", () => {
  test("should build with base url", () => {
    // given
    const host = "https://example.com";
    const path = "//api/1";
    const args = [1];
    const urlBuilder = new UrlBuilder(host, path, args);

    // when
    const actual = urlBuilder.build();

    // then
    expect(actual).toBe("https://example.com/api/1");
  });

  test("should replace url with given path variable metadata", () => {
    // given
    const host = "https://example.com";
    const path = "api/users/{id}";
    const args = [1, 2];
    const pathParam = new PathVariableBuilder(1, "id");
    const urlBuilder = new UrlBuilder(host, path, args, { pathParam });

    // when
    const actual = urlBuilder.build();

    // then
    expect(actual).toBe("https://example.com/api/users/2");
  });

  test("should append query string", () => {
    // given
    const host = "https://example.com";
    const path = "";
    const args = ["search"];
    const queryParam = new RequestParamBuilder(0, "keyword");
    const urlBuilder = new UrlBuilder(host, path, args, { queryParam });

    // when
    const actual = urlBuilder.build();

    // then
    expect(actual).toBe("https://example.com?keyword=search");
  });

  test("should append query string when provided as json", () => {
    // given
    const host = "https://example.com";
    const path = "api/user";
    const args = [{ keyword: "search" }];
    const queryParam = new RequestParamBuilder(0, undefined);
    const urlBuilder = new UrlBuilder(host, path, args, { queryParam });

    // when
    const actual = urlBuilder.build();

    // then
    expect(actual).toBe("https://example.com/api/user?keyword=search");
  });
});
