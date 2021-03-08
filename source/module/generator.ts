//

import {
  Glyph
} from "./glyph";


export class Generator<C = unknown> {

  protected config: C;

  public constructor(config: C) {
    this.config = config;
  }

  public getChars(): Array<string> {
    return [];
  }

  public glyph(char: string): Glyph | null {
    return null;
  }

}