declare module "qrcode" {
    const toDataURL: (text: string, options?: object) => Promise<string>;
    export { toDataURL };
  }
  