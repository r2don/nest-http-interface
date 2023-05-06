import * as ts from 'typescript';
import { describe, expect, test } from 'vitest';
import {
  returnStringServiceCode,
  hasResponseBodyServiceCode,
  needResponseBodyServiceCode,
  notPromiseServiceCode,
} from '../../fixtures/fake-service-code';
import { before } from '../compiler-plugin';

describe('HttpInterfaceVisitor', () => {
  test('should ignore if file name is not match', () => {
    // given
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
      newLine: ts.NewLineKind.LineFeed,
      noEmitHelpers: true,
      experimentalDecorators: true,
      strict: true,
    };
    const filename = 'not-match.ts';
    const fakeProgram = ts.createProgram([filename], options);

    // when
    const result = ts.transpileModule(needResponseBodyServiceCode, {
      compilerOptions: options,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should ignore if return type is not a class', () => {
    // given
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
      newLine: ts.NewLineKind.LineFeed,
      noEmitHelpers: true,
      experimentalDecorators: true,
      strict: true,
    };
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], options);

    // when
    const result = ts.transpileModule(returnStringServiceCode, {
      compilerOptions: options,
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
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
      newLine: ts.NewLineKind.LineFeed,
      noEmitHelpers: true,
      experimentalDecorators: true,
      strict: true,
    };
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], options);

    // when
    const result = ts.transpileModule(hasResponseBodyServiceCode, {
      compilerOptions: options,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should ignore if return type if not a promise ', () => {
    // given
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
      newLine: ts.NewLineKind.LineFeed,
      noEmitHelpers: true,
      experimentalDecorators: true,
      strict: true,
    };
    const filename = 'text.service.ts';
    const fakeProgram = ts.createProgram([filename], options);

    // when
    const result = ts.transpileModule(notPromiseServiceCode, {
      compilerOptions: options,
      fileName: filename,
      transformers: { before: [before({}, fakeProgram)] },
    });

    // then
    expect(result.outputText).toMatchSnapshot();
  });

  test('should override plugin suffix option', () => {
    // given
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
      newLine: ts.NewLineKind.LineFeed,
      noEmitHelpers: true,
      experimentalDecorators: true,
      strict: true,
    };
    const filename = '.custom.ts';
    const fakeProgram = ts.createProgram([filename], options);

    // when
    const result = ts.transpileModule(needResponseBodyServiceCode, {
      compilerOptions: options,
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
});
