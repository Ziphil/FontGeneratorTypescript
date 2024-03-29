//

import {
  Glyph,
  Metrics
} from "./glyph";
import {
  Contour,
  Part
} from "./part";


export abstract class Generator<C = unknown> {

  public chars!: Array<string>;
  protected config: C;
  protected partCache: Map<string | symbol, Contour | Part>;
  protected getterCache: Map<string | symbol, unknown>;

  public constructor(config: C) {
    this.config = config;
    this.partCache = new Map();
    this.getterCache = new Map();
  }

  protected purgePartCache(): void {
    this.partCache = new Map();
  }

  protected purgeGetterCache(): void {
    this.getterCache = new Map();
  }

  public abstract get metrics(): Metrics;

  public glyph(char: string): Glyph | null {
    return null;
  }

}