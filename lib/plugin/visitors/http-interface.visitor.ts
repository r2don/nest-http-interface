import type * as ts from 'typescript';

export class HttpInterfaceVisitor {
  visit(
    sourceFile: ts.SourceFile,
    ctx: ts.TransformationContext,
    program: ts.Program,
  ): ts.SourceFile {
    return sourceFile;
  }
}
