export interface PluginOptions {
  interfaceFilenameSuffix?: string | string[];
}

const defaultOptions: PluginOptions = {
  interfaceFilenameSuffix: ['.service.ts'],
};

export const mergePluginOptions = (
  options: Record<string, any> = {},
): PluginOptions => {
  if (typeof options.interfaceFilenameSuffix === 'string') {
    options.interfaceFilenameSuffix = [options.interfaceFilenameSuffix];
  }

  return {
    ...defaultOptions,
    ...options,
  };
};
