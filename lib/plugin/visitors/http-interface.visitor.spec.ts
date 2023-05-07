import * as ts from 'typescript';
import { describe, expect, test } from 'vitest';
import {
  returnStringServiceCode,
  hasResponseBodyServiceCode,
  needResponseBodyServiceCode,
  notPromiseServiceCode,
  arrayResponseBodyServiceCode,
} from '../../fixtures/fake-service-code';
import { before } from '../compiler-plugin';

describe('HttpInterfaceVisitor', () => {
  const compilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    newLine: ts.NewLineKind.LineFeed,
    noEmitHelpers: true,
    experimentalDecorators: true,
    strict: true,
  };

  test('should ignore if file name is not match', () => {
    // given
    const filename = 'not-match.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(needResponseBodyServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should ignore if return type is not a class', () => {
    // given
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(returnStringServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: {
        before: [before(undefined, fakeProgram)],
      },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should ignore if method has ResponseBody decorator', () => {
    // given
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(hasResponseBodyServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should ignore if return type if not a promise ', () => {
    // given
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(notPromiseServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should override plugin suffix option', () => {
    // given
    const filename = '.custom.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(needResponseBodyServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: {
        before: [
          before({ interfaceFilenameSuffix: '.custom.ts' }, fakeProgram),
        ],
      },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should handle array return type', () => {
    // given
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], compilerOptions);

    // when
    const result = ts.transpileModule(arrayResponseBodyServiceCode, {
      compilerOptions,
      fileName: filename,
      transformers: {
        before: [before({}, fakeProgram)],
      },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });
});
