import { PATH_VARIABLE_METADATA } from "./constants";

export type PathVariableMetadata = Map<number, string>;

export function PathVariable(name: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata: PathVariableMetadata =
      Reflect.getMetadata(PATH_VARIABLE_METADATA, target, propertyKey) ??
      new Map();

    metadata.set(parameterIndex, name);

    Reflect.defineMetadata(
      PATH_VARIABLE_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
