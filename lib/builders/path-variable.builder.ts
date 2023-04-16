export class PathVariableBuilder {
  metadata: Array<[index: number, key: string]> = [];

  constructor(index: number, key: string) {
    this.add(index, key);
  }

  add(index: number, key: string): void {
    this.metadata.push([index, key]);
  }

  build(url: string, args: any[]): string {
    return this.metadata.reduce<string>(
      (acc, [index, key]) =>
        acc.replace(new RegExp(`{${key}}`, "g"), args[index]),
      url
    );
  }
}
