/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var $: any;

declare var require: any;

declare module "*.json" {
    const value: any;
    export default value;
}
