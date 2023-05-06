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
) => (ctx: ts.TransformationContext) => ts.Transformer<any> = (
  options,
  program,
) => {
  const mergedOption = mergePluginOptions(options);

  return (ctx: ts.TransformationContext): ts.Transformer<any> => {
    return (sf: ts.SourceFile) => {
      if (
        isFilenameMatched(
          mergedOption.interfaceFilenameSuffix as string[],
          sf.fileName,
        )
      ) {
        return httpInterfaceVisitor.visit(sf, ctx, program);
      }

      return sf;
    };
  };
};
