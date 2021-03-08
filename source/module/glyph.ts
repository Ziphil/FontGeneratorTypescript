//

import {
  PathItem,
  Point
} from "paper";


export class Glyph {

  public part: PathItem;
  public metrics: Metrics;
  public width: number;

  protected constructor(part: PathItem, metrics: Metrics, width: number) {
    this.part = part;
    this.metrics = metrics;
    this.width = width;
  }

  public static byBearings(part: PathItem, metrics: Metrics, bearings: Bearings): Glyph {
    let clonedPart = part.clone();
    let width = part.bounds.width + bearings.left + bearings.right;
    clonedPart.translate(new Point(bearings.left, metrics.ascent));
    let glyph = new Glyph(clonedPart, metrics, width);
    return glyph;
  }

}


export type Metrics = {em: number, ascent: number, descent: number};
export type Bearings = {left: number, right: number};