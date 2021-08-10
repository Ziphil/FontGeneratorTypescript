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

  private originalItem: PathItem;
  public createItem: (metrics: Metrics) => [item: PathItem, width: number];

  private constructor(originalItem: PathItem, createItem: (metrics: Metrics) => [PathItem, number]) {
    this.originalItem = originalItem;
    this.createItem = createItem;
  }

  public toPart(): Part {
    let part = Part.of(this.originalItem);
    return part;
  }

  public static byBearings(part: Part | PathItem, bearings: Bearings): Glyph {
    let item = (part instanceof Part) ? part.item : part;
    let originalItem = item.clone();
    let createItem = function (metrics: Metrics): [PathItem, number] {
      let clonedItem = item.clone();
      let width = item.bounds.width + bearings.left + bearings.right;
      clonedItem.translate($(bearings.left, metrics.ascent));
      return [clonedItem, width];
    };
    let glyph = new Glyph(originalItem, createItem);
    return glyph;
  }

  public static byFixedSpacing(part: Part | PathItem, spacing: FixedSpacing): Glyph {
    let item = (part instanceof Part) ? part.item : part;
    let originalItem = item.clone();
    let createItem = function (metrics: Metrics): [PathItem, number] {
      let clonedItem = item.clone();
      let width = ("width" in spacing) ? spacing.width : spacing.rightEnd - spacing.leftEnd;
      clonedItem.translate($(-spacing.leftEnd, metrics.ascent));
      return [clonedItem, width];
    };
    let glyph = new Glyph(originalItem, createItem);
    return glyph;
  }

}


export type Metrics = {em: number, ascent: number, descent: number};
export type Bearings = {left: number, right: number};
export type FixedSpacing = {leftEnd: number, width: number} | {leftEnd: number, rightEnd: number};