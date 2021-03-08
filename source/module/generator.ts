//

import {
  Glyph
} from "./glyph";
import {
  Part
} from "./part";


export class Generator<C = unknown> {

  protected config: C;
  protected partCache: Map<string | symbol, Part>;

  public constructor(config: C) {
    this.config = config;
    this.partCache = new Map();
  }

  protected purgePartCache(): void {
    this.partCache = new Map();
  }

  public getChars(): Array<string> {
    return [];
  }

  public glyph(char: string): Glyph | null {
    return null;
  }

}