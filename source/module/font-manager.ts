//

import {
  Font
} from "../module";


export class FontManager {

  private rawFonts: {[id: string]: Font};

  public constructor(rawFonts: {[id: string]: Font}) {
    this.rawFonts = rawFonts;
  }

  public getAll(): Array<[string, Font]> {
    let fonts = Object.entries(this.rawFonts);
    return fonts;
  }

  public findById(id: string): Font | undefined {
    let font = this.rawFonts[id];
    return font;
  }

}