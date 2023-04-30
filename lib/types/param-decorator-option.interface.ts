export interface ParamDecoratorOption<I = unknown, O = unknown> {
  parameterIndex: number;
  key?: string;
  defaultValue?: string;
  transform?: (value: I) => O;
}
