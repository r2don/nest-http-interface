import { PATH_VARIABLE_METADATA } from './constants';
import { PathVariableBuilder } from '../builders/path-variable.builder';

export function PathVariable(name: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey == null) {
      return;
    }

    const builder: PathVariableBuilder | undefined = Reflect.getMetadata(
      PATH_VARIABLE_METADATA,
      target,
      propertyKey,
    );

    if (builder != null) {
      builder.add(parameterIndex, name);
      return;
    }

    Reflect.defineMetadata(
      PATH_VARIABLE_METADATA,
      new PathVariableBuilder(parameterIndex, name),
      target,
      propertyKey,
    );
  };
}
