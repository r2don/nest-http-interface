import * as ts from 'typescript';
import {
  DeleteExchange,
  GetExchange,
  HeadExchange,
  HttpInterface,
  OptionsExchange,
  PatchExchange,
  PostExchange,
  PutExchange,
} from '../../decorators';
import { GraphQLExchange } from '../../decorators/graphql-exchange.decorator';
import { ResponseBody } from '../../decorators/response-body.decorator';

export class HttpInterfaceVisitor {
  HTTP_INTERFACE_DECORATOR = HttpInterface.name;
  RESPONSE_BODY_DECORATOR = ResponseBody.name;
  ALL_EXCHANGE_DECORATORS = [
    GetExchange.name,
    PostExchange.name,
    PutExchange.name,
    DeleteExchange.name,
    PatchExchange.name,
    HeadExchange.name,
    OptionsExchange.name,
    GraphQLExchange.name,
  ];

  libModuleAlias = 'eager_module_1';
  libName = '@r2don/nest-http-interface';
  importSet = new Set<string>();

  visit(
    sourceFile: ts.SourceFile,
    ctx: ts.TransformationContext,
    _program: ts.Program,
  ): ts.Node {
    this.importSet.clear();
    const factory = ctx.factory;
    const visitNode = (node: ts.Node): ts.Node => {
      if (this.isHttpInterfaceClass(node)) {
        return this.visitMethods(node, factory);
      }

      if (ts.isSourceFile(node)) {
        return this.updateSourceFile(node, visitNode, ctx, factory);
      }

      return ts.visitEachChild(node, visitNode, ctx);
    };

    return ts.visitNode(sourceFile, visitNode);
  }

  private updateSourceFile(
    node: ts.SourceFile,
    visitNode: (node: ts.Node) => ts.Node,
    ctx: ts.TransformationContext,
    factory: ts.NodeFactory,
  ): ts.SourceFile {
    const visitedNode = ts.visitEachChild(node, visitNode, ctx);
    if (this.importSet.size === 0) {
      return visitedNode;
    }

    const importStatements = [...this.importSet].map((value) =>
      factory.createImportEqualsDeclaration(
        undefined,
        false,
        value,
        factory.createExternalModuleReference(
          factory.createStringLiteral(this.libName),
        ),
      ),
    );

    const existingStatements = Array.from(visitedNode.statements);
    return factory.updateSourceFile(visitedNode, [
      ...importStatements,
      ...existingStatements,
    ]);
  }

  private visitMethods(
    node: ts.ClassDeclaration,
    factory: ts.NodeFactory,
  ): ts.ClassDeclaration {
    const updatedMembers = node.members.map((member) => {
      if (!this.isExchangeMethod(member)) {
        return member;
      }

      return this.appendResponseBodyDecorator(member, factory);
    });

    return factory.updateClassDeclaration(
      node,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      updatedMembers,
    );
  }

  private isHttpInterfaceClass(node: ts.Node): node is ts.ClassDeclaration {
    return (
      ts.isClassDeclaration(node) &&
      this.hasDecorator(node, [this.HTTP_INTERFACE_DECORATOR])
    );
  }

  private appendResponseBodyDecorator(
    node: ts.MethodDeclaration,
    factory: ts.NodeFactory,
  ): ts.MethodDeclaration {
    const returnType = this.getReturnTypeAsText(node);

    if (returnType == null) {
      return node;
    }

    this.importSet.add(this.libModuleAlias);
    const decorator = factory.createDecorator(
      factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(this.libModuleAlias),
          factory.createIdentifier(this.RESPONSE_BODY_DECORATOR),
        ),
        [],
        [factory.createIdentifier(returnType)],
      ),
    );

    return factory.updateMethodDeclaration(
      node,
      /* c8 ignore next */
      [...(node.modifiers ?? []), decorator],
      node.asteriskToken,
      node.name,
      node.questionToken,
      node.typeParameters,
      node.parameters,
      node.type,
      node.body,
    );
  }

  private getReturnTypeAsText(node: ts.MethodDeclaration): string | undefined {
    if (
      node.type == null ||
      !ts.isTypeReferenceNode(node.type) ||
      !ts.isIdentifier(node.type.typeName) ||
      node.type.typeName.text !== 'Promise'
    ) {
      return undefined;
    }

    const innerType = this.getInnerType(node.type.typeArguments?.[0]);
    if (
      innerType == null ||
      !ts.isTypeReferenceNode(innerType) ||
      !ts.isIdentifier(innerType.typeName)
    ) {
      return undefined;
    }

    return innerType.typeName.text;
  }

  private getInnerType(node?: ts.TypeNode): ts.TypeNode | undefined {
    /* c8 ignore next 3 */
    if (node == null) {
      return undefined;
    }

    if (ts.isArrayTypeNode(node)) {
      return this.getInnerType(node.elementType);
    }

    if (
      ts.isTypeReferenceNode(node) &&
      ts.isIdentifier(node.typeName) &&
      node.typeName.text === 'Array'
    ) {
      return this.getInnerType(node.typeArguments?.[0]);
    }

    if (
      ts.isTypeOperatorNode(node) &&
      node.operator === ts.SyntaxKind.ReadonlyKeyword
    ) {
      return this.getInnerType(node.type);
    }

    return node;
  }

  private isExchangeMethod(
    member: ts.ClassElement,
  ): member is ts.MethodDeclaration {
    return (
      this.hasDecorator(member, this.ALL_EXCHANGE_DECORATORS) &&
      !this.hasDecorator(member, [this.RESPONSE_BODY_DECORATOR])
    );
  }

  private hasDecorator(node: ts.Node, decoratorNames: string[]): boolean {
    return this.getDecorators(node).some(
      (decorator) =>
        ts.isCallExpression(decorator.expression) &&
        ts.isIdentifier(decorator.expression.expression) &&
        decoratorNames.includes(decorator.expression.expression.text),
    );
  }

  private getDecorators(node: ts.Node): readonly ts.Decorator[] {
    if (!ts.canHaveDecorators(node)) {
      return [];
    }

    return ts.getDecorators(node) ?? [];
  }
}
