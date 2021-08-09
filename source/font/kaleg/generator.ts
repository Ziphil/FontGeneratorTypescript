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
    return this.config.weightConst * 100;
  }

  private get verThickness(): number {
    return this.horThickness * this.config.contrastRatio;
  }

  private get bowlWidth(): number {
    return this.config.bowlWidth;
  }

  private get edgeWidth(): number {
    return this.horThickness * this.config.edgeRatio;
  }

  private get edgeHeight(): number {
    return this.edgeWidth * this.config.edgeContrastRatio;
  }

  @part()
  public partTopLeftEdgeShape(): Part {
    let edgeShape = this.config.edgeShape;
    if (edgeShape === "miter") {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.edgeHeight)),
        Part.line($(0, 0), $(this.edgeWidth, 0))
      );
      return part;
    } else if (edgeShape === "bevel") {
      let part = Part.seq(
        Part.line($(0, 0), $(this.edgeWidth, -this.edgeHeight))
      );
      return part;
    } else {
      let part = Part.seq(
        Part.arc($(this.edgeWidth, 0), this.edgeWidth, -180, -90).scale(1, this.edgeHeight / this.edgeWidth)
      );
      return part;
    }
  }

  @part()
  public partTopLeftTipShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness + this.edgeHeight)),
      this.partTopLeftEdgeShape(),
      Part.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopLeftTip(): Part {
    let part = this.partTopLeftTipShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightTip(): Part {
    let part = this.partTopLeftTipShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftTip(): Part {
    let part = this.partTopLeftTipShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightTip(): Part {
    let part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partTopLeftVerticalBeakShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.horThickness, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopLeftVerticalBeak(): Part {
    let part = this.partTopLeftVerticalBeakShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightVerticalBeak(): Part {
    let part = this.partTopLeftVerticalBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftVerticalBeak(): Part {
    let part = this.partTopLeftVerticalBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightVerticalBeak(): Part {
    let part = this.partTopLeftVerticalBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partHorizontalBarShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.bowlWidth - this.horThickness * 2, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.bowlWidth + this.horThickness * 2, 0))
    );
    return part;
  }

  @part()
  public partTopBar(): Part {
    let part = this.partHorizontalBarShape();
    part.moveOrigin($(-this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomBar(): Part {
    let part = this.partHorizontalBarShape();
    part.moveOrigin($(-this.horThickness, 0));
    return part;
  }

  @part()
  public partVerticalBarShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.mean + this.verThickness * 2)),
      Part.line($(0, 0), $(this.horThickness, 0)),
      Part.line($(0, 0), $(0, this.mean - this.verThickness * 2)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partLeftBar(): Part {
    let part = this.partVerticalBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partRightBar(): Part {
    let part = this.partVerticalBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  @glyph("a", "A")
  public [Symbol()](): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("t", "T")
  public [Symbol()](): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightVerticalBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightVerticalBeak(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar()
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  public getMetrics(): Metrics {
    return this.metrics;
  }

}


export type KalegConfig = {
  weightConst: number,
  contrastRatio: number,
  edgeRatio: number,
  edgeContrastRatio: number,
  bowlWidth: number,
  edgeShape: KalegEdgeShape
};
export type KalegEdgeShape = "miter" | "bevel" | "round";