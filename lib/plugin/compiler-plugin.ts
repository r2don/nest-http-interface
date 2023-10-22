import type * as ts from 'typescript';
import { mergePluginOptions } from './merge-options';
import { HttpInterfaceVisitor } from './visitors/http-interface.visitor';

const httpInterfaceVisitor = new HttpInterfaceVisitor();

function isFilenameMatched(patterns: string[], filename: string): boolean {
  return patterns.some((path) => filename.includes(path));
}

export const before: (
  options: Record<string, any> | undefined,
  program: ts.Program,
) => ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory = (
  options,
  program,
) => {
  const mergedOption = mergePluginOptions(options);

  return (ctx) => {
    return (sourceFile) => {
      if (
        isFilenameMatched(
          mergedOption.interfaceFilenameSuffix as string[],
          sourceFile.fileName,
        )
      ) {
        return httpInterfaceVisitor.visit(sourceFile, ctx, program);
      }

      return sourceFile;
    };
  };
};
