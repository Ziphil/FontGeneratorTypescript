//


export class FontInfo {

  public author: string;
  public version: string;

  public constructor(author?: string, version?: string) {
    this.author = author ?? "Unknown";
    this.version = version ?? "0.0.0";
  }

  public get copyright(): string {
    let date = new Date();
    let copyright = "Copyright";
    copyright += " " + date.getFullYear().toString();
    copyright += " " + this.author;
    return copyright;
  }

}