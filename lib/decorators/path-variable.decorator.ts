import { PATH_VARIABLE_METADATA } from "./constants";
import { MetadataMap } from "../types/metadata-map";

export type PathVariableMetadata = MetadataMap<number, string>;

export function PathVariable(name: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "undefined") {
      return;
    }

    const metadata: PathVariableMetadata =
      Reflect.getMetadata(PATH_VARIABLE_METADATA, target, propertyKey) ??
      new MetadataMap();

    metadata.set(parameterIndex, name);

    Reflect.defineMetadata(
      PATH_VARIABLE_METADATA,
      metadata,
      target,
      propertyKey
    );
  };
}
