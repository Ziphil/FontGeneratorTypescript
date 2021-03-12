//

import {
  PathItem
} from "paper";
import {
  Part
} from "./part";
import {
  $
} from "./point";


export class Glyph {

  public item: PathItem;
  public metrics: Metrics;
  public width: number;

  private constructor(item: PathItem, metrics: Metrics, width: number) {
    this.item = item;
    this.metrics = metrics;
    this.width = width;
  }

  public static byBearings(part: Part | PathItem, metrics: Metrics, bearings: Bearings): Glyph {
    let item = (part instanceof Part) ? part.item : part;
    let clonedItem = item.clone();
    let width = item.bounds.width + bearings.left + bearings.right;
    clonedItem.translate($(bearings.left, metrics.ascent));
    let glyph = new Glyph(clonedItem, metrics, width);
    return glyph;
  }

}


export type Metrics = {em: number, ascent: number, descent: number};
export type Bearings = {left: number, right: number};