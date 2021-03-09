//


export class FontInfo {

  public copyright: string;
  public version: string;

  public constructor(copyright?: string, version?: string) {
    this.copyright = copyright ?? "None";
    this.version = version ?? "0.0.0";
  }

}