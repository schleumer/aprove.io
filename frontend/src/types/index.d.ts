declare module "@" {
  global {
    interface Window {
      __openedSections__: any;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
      Intl: typeof Intl;
    }

    interface NodeModule {
      hot: any;
    }
  }
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.jpeg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  const content: any;
  export default content;
}
