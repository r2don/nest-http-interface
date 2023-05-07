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
  static HTTP_INTERFACE_DECORATOR = HttpInterface.name;
  static RESPONSE_BODY_DECORATOR = ResponseBody.name;
  static ALL_EXCHANGE_DECORATORS = [
    GetExchange.name,
    PostExchange.name,
    PutExchange.name,
    DeleteExchange.name,
    PatchExchange.name,
    HeadExchange.name,
    OptionsExchange.name,
    GraphQLExchange.name,
  ];

  visit(
    sourceFile: ts.SourceFile,
    ctx: ts.TransformationContext,
    _program: ts.Program,
  ): ts.Node {
    const factory = ctx.factory;
    const visitNode = (node: ts.Node): ts.Node => {
      if (!this.isHttpInterfaceClass(node)) {
        return ts.visitEachChild(node, visitNode, ctx);
      }

      const updatedMembers = node.members.map((member) => {
        if (!this.isExchangeMethod(member)) {
          return member;
        }

        return this.appendResponseBodyDecorator(member, factory);
      });

      return factory.updateClassDeclaration(
        node,
        this.getDecorators(node),
        node.name,
        node.typeParameters,
        node.heritageClauses,
        updatedMembers,
      );
    };

    return ts.visitNode(sourceFile, visitNode);
  }

  private isHttpInterfaceClass(node: ts.Node): node is ts.ClassDeclaration {
    return (
      ts.isClassDeclaration(node) &&
      this.hasDecorator(node, [HttpInterfaceVisitor.HTTP_INTERFACE_DECORATOR])
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

    const decorator = factory.createDecorator(
      factory.createCallExpression(
        factory.createIdentifier('ResponseBody'),
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
      this.hasDecorator(member, HttpInterfaceVisitor.ALL_EXCHANGE_DECORATORS) &&
      !this.hasDecorator(member, [HttpInterfaceVisitor.RESPONSE_BODY_DECORATOR])
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
