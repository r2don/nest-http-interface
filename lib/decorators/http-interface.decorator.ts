import { HTTP_INTERFACE_METADATA } from "./constants";

export function HttpInterface(url = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(HTTP_INTERFACE_METADATA, url, target);
  };
}
