/* c8 ignore start */
/**
 * codes are from '@nestjs/swagger' package
 */

import { isAbsolute, posix } from 'path';

export function replaceImportPath(
  typeReference: string,
  fileName: string,
): string | undefined {
  if (!typeReference.includes('import')) {
    return typeReference;
  }
  let importPath = /\("([^)]).+(")/.exec(typeReference)?.[0];
  if (importPath == null) {
    return undefined;
  }
  importPath = convertPath(importPath);
  importPath = importPath.slice(2, importPath.length - 1);

  try {
    if (isAbsolute(importPath)) {
      throw new Error();
    }
    require.resolve(importPath);
    return typeReference.replace('import', 'require');
  } catch (_error) {
    let relativePath = posix.relative(posix.dirname(fileName), importPath);
    relativePath = relativePath[0] !== '.' ? './' + relativePath : relativePath;

    const nodeModulesText = 'node_modules';
    const nodeModulePos = relativePath.indexOf(nodeModulesText);
    if (nodeModulePos >= 0) {
      relativePath = relativePath.slice(
        nodeModulePos + nodeModulesText.length + 1, // slash
      );

      const typesText = '@types';
      const typesPos = relativePath.indexOf(typesText);
      if (typesPos >= 0) {
        relativePath = relativePath.slice(
          typesPos + typesText.length + 1, // slash
        );
      }

      const indexText = '/index';
      const indexPos = relativePath.indexOf(indexText);
      if (indexPos >= 0) {
        relativePath = relativePath.slice(0, indexPos);
      }
    }

    typeReference = typeReference.replace(importPath, relativePath);
    return typeReference.replace('import', 'require');
  }
}

/**
 * Converts Windows specific file paths to posix
 * @param windowsPath
 */
function convertPath(windowsPath: string): string {
  return windowsPath
    .replace(/^\\\\\?\\/, '')
    .replace(/\\/g, '/')
    .replace(/\/\/+/g, '/');
}

/* c8 ignore end */
