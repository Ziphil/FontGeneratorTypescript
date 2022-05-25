//

import {
  $,
  Bearings,
  Generator,
  Glyph,
  Metrics,
  Part,
  PathUtil,
  generator,
  glyph,
  part
} from "../../module";


@generator()
export class ColfomGenerator extends Generator<ColfomConfig> {

  public get metrics(): Metrics {
    let ascent = this.mean + this.descent + this.extraAscent;
    let descent = this.descent + this.extraDescent;
    let em = descent + ascent;
    let metrics = {em, ascent, descent};
    return metrics;
  }

  private get descent(): number {
    return 250;
  }

  private get mean(): number {
    return 500;
  }

  private get extraDescent(): number {
    return 25;
  }

  private get extraAscent(): number {
    return 25;
  }

  private get bearing(): number {
    return this.bowlWidth * 0.09;
  }

  private get thickness(): number {
    return this.config.weightConst * 100;
  }

  private get bowlWidth(): number {
    return this.mean * 1;
  }

  private createBearings(): Bearings {
    let left = this.bearing;
    let right = this.bearing;
    let bearings = {left, right};
    return bearings;
  }

  @glyph("#")
  public glyphTest(): Glyph {
    let part = Part.union(
      Part.circle($(this.bowlWidth / 2, -this.bowlWidth / 2), this.bowlWidth / 2).toStroke(this.thickness / 2, "round", "round")
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

}


export type ColfomConfig = {
  weightConst: number
};