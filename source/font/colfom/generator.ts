//

import {
  $,
  Bearings,
  Generator,
  Glyph,
  Metrics,
  Part,
  generator,
  glyph,
  part
} from "../../module";
import {
  MathUtil
} from "../../util/math";


@generator()
export class ColfomGenerator extends Generator<ColfomConfig> {

  public get metrics(): Metrics {
    const ascent = this.mean + this.descent + this.extraAscent;
    const descent = this.descent + this.extraDescent;
    const em = descent + ascent;
    const metrics = {em, ascent, descent};
    return metrics;
  }

  private get descent(): number {
    return 250;
  }

  private get mean(): number {
    return 500;
  }

  private get overshoot(): number {
    return 15;
  }

  private get extraDescent(): number {
    return 25;
  }

  private get extraAscent(): number {
    return 25;
  }

  private get virtualDescent(): number {
    return this.descent - this.overshoot;
  }

  private get virtualMean(): number {
    return this.mean + 2 * this.overshoot - this.thickness;
  }

  private get bearing(): number {
    return (this.bowlWidth + this.thickness) * 0.07;
  }

  private get thickness(): number {
    return this.config.weightConst * 90;
  }

  private get bowlHeight(): number {
    return this.virtualMean;
  }

  private get bowlWidth(): number {
    return this.virtualMean * 0.9;
  }

  private createBearings(): Bearings {
    const left = this.bearing;
    const right = this.bearing;
    const bearings = {left, right};
    return bearings;
  }

  @part()
  public partBowl(): Part {
    const part = Part.union(
      Part.circle($.origin, this.bowlHeight / 2).scale(this.bowlWidth / this.bowlHeight, 1).toStroke(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("a", "A")
  public glyphAt(): Glyph {
    const part = Part.union(
      this.partBowl()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get tailDepth(): number {
    return this.bowlHeight / 2 * 0.5;
  }

  @part()
  public partLesTail(): Part {
    const radius = this.bowlHeight / 2;
    const startPoint = $(Math.sqrt(this.tailDepth * (radius * 2 - this.tailDepth)), radius - this.tailDepth);
    const endPoint = startPoint.add($(-(this.tailDepth + this.virtualDescent) * (radius - this.tailDepth) / Math.sqrt(this.tailDepth * (radius * 2 - this.tailDepth)), this.tailDepth + this.virtualDescent));
    const part = Part.union(
      Part.line(startPoint, endPoint).scale(this.bowlWidth / this.bowlHeight, 1).toStroke(this.thickness / 2, "round", "round")
    );
    return part;
  }

  private get transphoneGap(): number {
    return (this.bowlWidth + this.thickness) * 0.14;
  }

  private get transphoneMargin(): number {
    return this.mean * 0.03;
  }

  @part()
  public partTransphone(): Part {
    const startPoint = $(0, -this.bowlHeight / 2 + this.transphoneMargin);
    const endPoint = $(0, this.bowlHeight / 2 - this.transphoneMargin);
    const part = Part.union(
      Part.line(startPoint, endPoint).toStroke(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("l", "L")
  public glyphLes(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("r", "R")
  public glyphRes(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("p", "P")
  public glyphPal(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().rotateHalfTurn()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("b", "B")
  public glyphBol(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().rotateHalfTurn(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("c", "C")
  public glyphCal(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().reflectHor()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("q", "Q")
  public glyphQol(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().reflectHor(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("k", "K")
  public glyphKal(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().reflectVer()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("g", "G")
  public glyphGol(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partLesTail().reflectVer(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get talBeakHeight(): number {
    return this.bowlHeight / 2 * 0.4;
  }

  private get talWidth(): number {
    return (this.bowlHeight / 2 + Math.sqrt(this.talBeakHeight * (this.bowlHeight - this.talBeakHeight))) * this.bowlWidth / this.bowlHeight;
  }

  @part()
  public partTal(): Part {
    const radius = this.bowlHeight / 2;
    const angle = MathUtil.atan2Deg(radius - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (radius * 2 - this.talBeakHeight)));
    const part = Part.union(
      Part.arc($.origin, this.bowlHeight / 2, angle, 360 - angle).scale(this.bowlWidth / this.bowlHeight, 1).toStroke(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("t", "T")
  public glyphTal(): Glyph {
    const part = Part.union(
      this.partTal()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("d", "D")
  public glyphDol(): Glyph {
    const part = Part.union(
      this.partTal(),
      this.partTransphone().translate($(this.talWidth - this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("f", "F")
  public glyphFal(): Glyph {
    const part = Part.union(
      this.partTal().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("v", "V")
  public glyphVol(): Glyph {
    const part = Part.union(
      this.partTal().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0)),
      this.partTransphone().translate($(this.talWidth - this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @part()
  public partItBeak(): Part {
    const radius = this.bowlHeight / 2;
    const fromAngle = 360 - MathUtil.atan2Deg(radius - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (radius * 2 - this.talBeakHeight)));
    const toAngle = 180 - MathUtil.atan2Deg(radius - this.tailDepth, Math.sqrt(this.tailDepth * (radius * 2 - this.tailDepth)));
    const part = Part.union(
      Part.arc($.origin, this.bowlHeight / 2, fromAngle, toAngle).scale(this.bowlWidth / this.bowlHeight, 1).toStroke(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("i", "I")
  public glyphIt(): Glyph {
    const part = Part.union(
      this.partItBeak(),
      this.partLesTail().reflectHor()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("e", "E")
  public glyphEt(): Glyph {
    const part = Part.union(
      this.partItBeak().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0)),
      this.partLesTail().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }


  private get spaceWidth(): number {
    return this.bowlWidth * 0.6;
  }

  @glyph(" ")
  public glyphSpace(): Glyph {
    const part = Part.empty();
    const bearings = {left: this.spaceWidth, right: 0};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

}


export type ColfomConfig = {
  weightConst: number
};