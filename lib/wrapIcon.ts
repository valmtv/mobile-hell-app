import { cssInterop } from "nativewind";
import { ComponentType } from "react";

export function wrapIcon<T>(Icon: ComponentType<T>) {
  return cssInterop(Icon, { className: true });
}

