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
export class KalegGenerator extends Generator<KalegConfig> {

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

  private get metrics(): Metrics {
    let ascent = this.mean + this.descent + this.extraAscent;
    let descent = this.descent + this.extraDescent;
    let em = descent + ascent;
    let metrics = {em, ascent, descent};
    return metrics;
  }

  private get bearings(): Bearings {
    let left = this.bearing;
    let right = this.bearing;
    let bearings = {left, right};
    return bearings;
  }

  private get horThickness(): number {
    return this.config.horThickness;
  }

  private get verThickness(): number {
    return this.horThickness * this.config.contrastRatio;
  }

  private get bowlWidth(): number {
    return this.bowlWidth;
  }

  public getMetrics(): Metrics {
    return this.metrics;
  }

}


export type KalegConfig = {horThickness: number, contrastRatio: number, bowlWidth: number, edgeShape: KalegEdgeShape};
export type KalegEdgeShape = "miter" | "bevel" | "round";