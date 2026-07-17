/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    any
  >;
  export default component;
}

declare module "process" {
  const process: NodeJS.Process;
  export default process;
}

interface Window {
  global: Window;
  Buffer: typeof Buffer;
  process: NodeJS.Process;
}
