//

import {
  $,
  Bearings,
  Contour,
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
    return this.config.weightConst * 87;
  }

  private get bowlHeight(): number {
    return this.virtualMean;
  }

  private get bowlWidth(): number {
    return this.virtualMean * 0.9;
  }

  private get bowlRatio(): number {
    return this.bowlWidth / this.bowlHeight;
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
      Contour.circle($.origin, this.bowlHeight / 2).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
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

  private get transphoneGap(): number {
    return (this.bowlWidth + this.thickness) * 0.14;
  }

  private get transphoneVerMargin(): number {
    return this.mean * 0.03;
  }

  @part()
  public partTransphone(): Part {
    const startPoint = $(0, -this.bowlHeight / 2 + this.transphoneVerMargin);
    const endPoint = $(0, this.bowlHeight / 2 - this.transphoneVerMargin);
    const part = Part.union(
      Contour.line(startPoint, endPoint).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("x", "X")
  public glyphXal(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partBowl().translate($(this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("j", "J")
  public glyphJol(): Glyph {
    const part = Part.union(
      this.partBowl(),
      this.partBowl().translate($(this.bowlWidth, 0)),
      this.partTransphone().translate($(this.bowlWidth * 3 / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get lesTailDepth(): number {
    return this.bowlHeight / 2 * 0.5;
  }

  @part()
  public partLesTail(): Part {
    const radius = this.bowlHeight / 2;
    const height = this.lesTailDepth + this.virtualDescent;
    const startPoint = $(Math.sqrt(this.lesTailDepth * (radius * 2 - this.lesTailDepth)), radius - this.lesTailDepth);
    const endPoint = startPoint.add($(-height * (radius - this.lesTailDepth) / Math.sqrt(this.lesTailDepth * (radius * 2 - this.lesTailDepth)), height));
    const part = Part.union(
      Contour.line(startPoint, endPoint).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
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
    return (this.bowlHeight / 2 + Math.sqrt(this.talBeakHeight * (this.bowlHeight - this.talBeakHeight))) * this.bowlRatio;
  }

  @part()
  public partTal(): Part {
    const angle = MathUtil.atan2Deg(this.bowlHeight / 2 - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (this.bowlHeight / 2 * 2 - this.talBeakHeight)));
    const part = Part.union(
      Contour.arc($.origin, this.bowlHeight / 2, angle, 360 - angle).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
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
  public partUpperIt(): Part {
    const radius = this.bowlHeight / 2;
    const fromAngle = 360 - MathUtil.atan2Deg(radius - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (radius * 2 - this.talBeakHeight)));
    const toAngle = 180 - MathUtil.atan2Deg(radius - this.lesTailDepth, Math.sqrt(this.lesTailDepth * (radius * 2 - this.lesTailDepth)));
    const part = Part.union(
      Contour.arc($.origin, this.bowlHeight / 2, fromAngle, toAngle).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("i", "I")
  public glyphIt(): Glyph {
    const part = Part.union(
      this.partUpperIt(),
      this.partLesTail().reflectHor()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("e", "E")
  public glyphEt(): Glyph {
    const part = Part.union(
      this.partUpperIt().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0)),
      this.partLesTail().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get yesLegBend(): number {
    return this.bowlWidth / 2 * 0.45;
  }

  private get yesLegVerMargin(): number {
    return this.mean * 0.03;
  }

  private get yesLegHeight(): number {
    return this.bowlHeight / 2 - this.yesLegVerMargin;
  }

  @part()
  public partYesBowl(): Part {
    const part = Part.union(
      Contour.arc($.origin, this.bowlHeight / 2, 180, 360).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @part()
  public partYesLeg(): Part {
    const bend = this.yesLegBend / this.bowlRatio;;
    const height = this.yesLegHeight;
    const leftHandle = height * 0.6;
    const part = Part.union(
      Contour.bezier($.origin, $(0, leftHandle), null, $(bend, height)).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(-this.bowlWidth / 2, 0));
    return part;
  }

  @glyph("y", "Y")
  public glyphYes(): Glyph {
    const part = Part.union(
      this.partYesBowl(),
      this.partYesLeg(),
      this.partYesLeg().reflectHor()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("h", "H")
  public glyphHes(): Glyph {
    const part = Part.union(
      this.partYesBowl(),
      this.partYesLeg(),
      this.partYesLeg().reflectHor(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get spineWidth(): number {
    return this.bowlWidth * 0.9;
  }

  @part()
  public partNesBowl(): Part {
    const part = Part.union(
      Contour.arc($.origin, this.bowlHeight / 2, 180, 270).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @part()
  public partHalfSpine(): Part {
    const width = (this.spineWidth / 2) / this.bowlRatio;
    const height = this.bowlHeight / 2;
    const handle = width * 0.85;
    const part = Part.union(
      Contour.bezier($.origin, $(handle, 0), null, $(width, -height)).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(0, this.bowlHeight / 2));
    return part;
  }

  @glyph("n", "N")
  public glyphNes(): Glyph {
    const part = Part.union(
      this.partNesBowl().reflectVer(),
      this.partNesBowl().reflectHor().translate($(this.spineWidth, 0)),
      this.partYesLeg().reflectVer(),
      this.partYesLeg().reflectHor().translate($(this.spineWidth, 0)),
      this.partHalfSpine(),
      this.partHalfSpine().reflectHor().reflectVer().translate($(this.spineWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("m", "M")
  public glyphMes(): Glyph {
    const part = Part.union(
      this.partNesBowl().reflectVer(),
      this.partNesBowl().reflectHor().translate($(this.spineWidth, 0)),
      this.partYesLeg().reflectVer(),
      this.partYesLeg().reflectHor().translate($(this.spineWidth, 0)),
      this.partHalfSpine(),
      this.partHalfSpine().reflectHor().reflectVer().translate($(this.spineWidth, 0)),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.spineWidth + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("s", "S")
  public glyphSal(): Glyph {
    const part = Part.union(
      this.partYesBowl().reflectVer(),
      this.partYesLeg().reflectVer(),
      this.partYesLeg().reflectHor().reflectVer()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("z", "Z")
  public glyphZol(): Glyph {
    const part = Part.union(
      this.partYesBowl().reflectVer(),
      this.partYesLeg().reflectVer(),
      this.partYesLeg().reflectHor().reflectVer(),
      this.partTransphone().translate($(this.bowlWidth / 2 + this.thickness + this.transphoneGap, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get utTailDepth(): number {
    return this.bowlHeight / 2 * 0.1;
  }

  private get utWidth(): number {
    return (this.bowlHeight / 2 + Math.sqrt(this.utTailDepth * (this.bowlHeight - this.utTailDepth))) * this.bowlRatio;
  }

  @part()
  public partUpperUt(): Part {
    const radius = this.bowlHeight / 2;
    const fromAngle = MathUtil.atan2Deg(radius - this.utTailDepth, Math.sqrt(this.utTailDepth * (radius * 2 - this.utTailDepth)));
    const toAngle = MathUtil.atan2Deg(radius - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (radius * 2 - this.talBeakHeight)));
    const part = Part.union(
      Contour.arc($.origin, this.bowlHeight / 2, fromAngle, 360 - toAngle).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @part()
  public partUtTail(): Part {
    const radius = this.bowlHeight / 2;
    const height = this.utTailDepth + this.virtualDescent;
    const startPoint = $(Math.sqrt(this.utTailDepth * (radius * 2 - this.utTailDepth)), radius - this.utTailDepth);
    const endPoint = startPoint.add($(-height * (radius - this.lesTailDepth) / Math.sqrt(this.lesTailDepth * (radius * 2 - this.lesTailDepth)), height));
    const part = Part.union(
      Contour.line(startPoint, endPoint).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    return part;
  }

  @glyph("u", "U")
  public glyphUt(): Glyph {
    const part = Part.union(
      this.partUpperUt(),
      this.partUtTail()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("o", "O")
  public glyphOt(): Glyph {
    const part = Part.union(
      this.partUpperUt().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0)),
      this.partUtTail().rotateHalfTurn().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get diacriticThickness(): number {
    return Math.min(this.thickness, this.config.weightConst * 30 + 50);
  }

  private get diacriticGap(): number {
    return this.mean * 0.1;
  }

  private get circumflexHeight(): number {
    return this.mean * 0.25;
  }

  private get circumflexWidth(): number {
    return this.circumflexHeight * 1.1;
  }

  @part()
  public partCircumflex(): Part {
    const part = Part.union(
      Contour.circle($.origin, this.circumflexHeight / 2).scale(this.circumflexWidth / this.circumflexHeight, 1).toStrokePart(this.diacriticThickness / 2, "round", "round")
    );
    part.translate($(0, -this.bowlHeight / 2 - this.circumflexHeight / 2 - this.thickness / 2 - this.diacriticThickness / 2 - this.diacriticGap));
    return part;
  }

  private get acuteBowlHeight(): number {
    return this.mean * 0.6;
  }

  private get acuteBowlWidth(): number {
    return this.acuteBowlHeight * 0.9;
  }

  private get acuteHeight(): number {
    return this.talBeakHeight / this.bowlHeight * this.acuteBowlHeight;
  }

  @part()
  public partAcute(): Part {
    const angle = MathUtil.atan2Deg(this.bowlHeight / 2 - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (this.bowlHeight / 2 * 2 - this.talBeakHeight)));
    const part = Part.union(
      Contour.arc($.origin, this.acuteBowlHeight / 2, 360 - angle, 180 + angle).scale(this.acuteBowlWidth / this.acuteBowlHeight, 1).toStrokePart(this.diacriticThickness / 2, "round", "round")
    );
    part.translate($(0, -this.bowlHeight / 2 + this.acuteBowlHeight / 2 - this.acuteHeight - this.diacriticThickness / 2 - this.thickness / 2 - this.diacriticGap));
    return part;
  }

  @part()
  public partGrave(): Part {
    const angle = MathUtil.atan2Deg(this.bowlHeight / 2 - this.talBeakHeight, Math.sqrt(this.talBeakHeight * (this.bowlHeight / 2 * 2 - this.talBeakHeight)));
    const part = Part.union(
      Contour.arc($.origin, this.acuteBowlHeight / 2, angle, 180 - angle).scale(this.acuteBowlWidth / this.acuteBowlHeight, 1).toStrokePart(this.diacriticThickness / 2, "round", "round")
    );
    part.translate($(0, -this.bowlHeight / 2 - this.acuteBowlHeight / 2 - this.thickness / 2 - this.diacriticThickness / 2 - this.diacriticGap));
    return part;
  }

  @glyph("â", "Â")
  public glyphAtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphAt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partCircumflex()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("á", "Á")
  public glyphAtAcute(): Glyph {
    const part = Part.union(
      this.glyphAt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partAcute()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("à", "À")
  public glyphAtGrave(): Glyph {
    const part = Part.union(
      this.glyphAt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partGrave()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ê", "Ê")
  public glyphEtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphEt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partCircumflex().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("é", "É")
  public glyphEtAcute(): Glyph {
    const part = Part.union(
      this.glyphEt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partAcute().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("è", "È")
  public glyphEtGrave(): Glyph {
    const part = Part.union(
      this.glyphEt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partGrave().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("î", "Î")
  public glyphItCircumflex(): Glyph {
    const part = Part.union(
      this.glyphIt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partCircumflex()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("í", "Í")
  public glyphItAcute(): Glyph {
    const part = Part.union(
      this.glyphIt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partAcute()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ì", "Ì")
  public glyphItGrave(): Glyph {
    const part = Part.union(
      this.glyphIt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partGrave()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ô", "Ô")
  public glyphOtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphOt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partCircumflex().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ó", "Ó")
  public glyphOtAcute(): Glyph {
    const part = Part.union(
      this.glyphOt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partAcute().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ò", "Ò")
  public glyphOtGrave(): Glyph {
    const part = Part.union(
      this.glyphOt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partGrave().reflectVer().translate($(this.talWidth - this.bowlWidth, 0))
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("û", "Û")
  public glyphUtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partCircumflex()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ú", "Ú")
  public glyphUtAcute(): Glyph {
    const part = Part.union(
      this.glyphUt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partAcute()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ù", "Ù")
  public glyphUtGrave(): Glyph {
    const part = Part.union(
      this.glyphUt().toPart().translate($(-this.bowlWidth / 2 - this.thickness / 2, this.mean / 2)),
      this.partGrave()
    );
    part.translate($(this.bowlWidth / 2 + this.thickness / 2, -this.mean / 2));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get dotHeight(): number {
    return this.thickness * 1.3;
  }

  private get dotGap(): number {
    return (this.bowlWidth + this.thickness) * 0.07;
  }

  @part()
  public partDot(): Part {
    const part = Part.seq(
      Contour.circle($.origin, this.dotHeight / 2)
    );
    part.translate($(this.dotHeight / 2, -this.dotHeight / 2 + this.overshoot));
    return part;
  }

  @glyph(",")
  public glyphTadek(): Glyph {
    const part = Part.union(
      this.partDot()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph(".")
  public glyphDek(): Glyph {
    const part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.dotHeight + this.dotGap, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get badekLeftBearing(): number {
    return this.bearing * 1.8;
  }

  private get badekGap(): number {
    return this.mean * 0.15;
  }

  @part()
  public partBadekStem(): Part {
    const height = this.mean + this.descent - this.dotHeight + this.overshoot - this.badekGap - this.thickness;
    const part = Part.union(
      Contour.line($.origin, $(0, -height)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.dotHeight / 2, -this.dotHeight + this.overshoot - this.badekGap - this.thickness / 2));
    return part;
  }

  @glyph("!")
  public glyphBadek(): Glyph {
    const part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.dotHeight + this.dotGap, 0)),
      this.partBadekStem()
    );
    const bearings = {left: this.badekLeftBearing, right: this.bearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  private get padekCurveHeight(): number {
    return this.bowlHeight * 0.6;
  }

  private get padekCurveBend(): number {
    return this.yesLegBend / this.yesLegHeight * this.padekCurveHeight;
  }

  @part()
  public partPadekCurve(): Part {
    const bend = this.padekCurveBend / this.bowlRatio;;
    const height = this.padekCurveHeight;
    const leftHandle = height * 0.6;
    const part = Part.union(
      Contour.bezier($.origin, $(0, -leftHandle), null, $(bend, -height)).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.dotHeight / 2, -this.mean - this.descent + this.padekCurveHeight + this.thickness / 2));
    return part;
  }

  @part()
  public partPadekStem(): Part {
    const height = this.mean + this.descent - this.dotHeight + this.overshoot - this.badekGap - this.thickness - this.padekCurveHeight;
    const part = Part.union(
      Contour.line($.origin, $(0, -height)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.dotHeight / 2, -this.dotHeight + this.overshoot - this.badekGap - this.thickness / 2));
    return part;
  }

  @glyph("?")
  public glyphPadek(): Glyph {
    const part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.dotHeight + this.dotGap, 0)),
      this.partPadekStem(),
      this.partPadekCurve()
    );
    const bearings = {left: this.badekLeftBearing, right: this.bearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  @glyph("⁉", "‽")
  public glyphBapadek(): Glyph {
    const part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.dotHeight + this.dotGap, 0)),
      this.partBadekStem(),
      this.partPadekStem().translate($(this.dotGap + this.dotHeight, 0)),
      this.partPadekCurve().translate($(this.dotGap + this.dotHeight, 0))
    );
    const bearings = {left: this.badekLeftBearing, right: this.bearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  private get dikakHeight(): number {
    return this.bowlHeight * 0.4;
  }

  private get dikakBend(): number {
    return this.yesLegBend / this.yesLegHeight * this.dikakHeight;
  }

  private get dikakRightBearing(): number {
    return -this.bearing * 0.5;
  }

  @part()
  public partDikak(): Part {
    const bend = this.dikakBend / this.bowlRatio;;
    const height = this.dikakHeight;
    const leftHandle = height * 0.6;
    const part = Part.union(
      Contour.bezier($.origin, $(0, -leftHandle), null, $(bend, -height)).scale(this.bowlRatio, 1).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.mean - this.descent + this.dikakHeight + this.thickness / 2));
    return part;
  }

  @glyph("ʻ")
  public glyphDikak(): Glyph {
    const part = Part.union(
      this.partDikak()
    );
    const bearings = {left: this.bearing, right: this.dikakRightBearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  private get nokHeight(): number {
    return this.bowlHeight * 0.4;
  }

  @part()
  public partNok(): Part {
    const height = this.dikakHeight;
    const part = Part.union(
      Contour.line($.origin, $(0, -height)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.mean - this.descent + this.nokHeight + this.thickness / 2));
    return part;
  }

  @glyph("'")
  public glyphNok(): Glyph {
    const part = Part.union(
      this.partNok()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get fekAltitude(): number {
    return this.mean / 2;
  }

  private get fekWidth(): number {
    return (this.bowlWidth + this.thickness) * 0.6;
  }

  @part()
  public partFek(): Part {
    const width = this.fekWidth;
    const part = Part.union(
      Contour.line($.origin, $(width, 0)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.fekAltitude));
    return part;
  }

  @glyph("-")
  public glyphFek(): Glyph {
    const part = Part.union(
      this.partFek()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get dashWidth(): number {
    return (this.bowlWidth + this.thickness) * 2;
  }

  @part()
  public partDash(): Part {
    const width = this.dashWidth;
    const part = Part.union(
      Contour.line($.origin, $(width, 0)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.fekAltitude));
    return part;
  }

  @glyph("—")
  public glyphDash(): Glyph {
    const part = Part.union(
      this.partDash()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get fohakWidth(): number {
    return (this.bowlWidth + this.thickness) * 1.5;
  }

  @part()
  public partFohak(): Part {
    const width = this.fohakWidth;
    const part = Part.union(
      Contour.line($.origin, $(width, 0)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.thickness / 2));
    return part;
  }

  @glyph("…")
  public glyphFohak(): Glyph {
    const part = Part.union(
      this.partFohak()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get rakutWidth(): number {
    return (this.bowlWidth + this.thickness) * 0.4;
  }

  private get rakutHeight(): number {
    return this.mean * 0.9;
  }

  private get rakutBearing(): number {
    return 0;
  }

  @part()
  public partRakutHorizontalLine(): Part {
    const width = this.rakutWidth;
    const part = Part.union(
      Contour.line($.origin, $(width, 0)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.mean - this.descent + this.thickness / 2));
    return part;
  }

  @part()
  public partRakutVerticalLine(): Part {
    const height = this.rakutHeight;
    const part = Part.union(
      Contour.line($.origin, $(0, height)).toStrokePart(this.thickness / 2, "round", "round")
    );
    part.translate($(this.thickness / 2, -this.mean - this.descent + this.thickness / 2));
    return part;
  }

  @glyph("[", "«")
  public glyphOpeningRakut(): Glyph {
    const part = Part.union(
      this.partRakutHorizontalLine(),
      this.partRakutVerticalLine()
    );
    const bearings = {left: this.bearing, right: this.rakutBearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  @glyph("]", "»")
  public glyphClosingRakut(): Glyph {
    const part = Part.union(
      this.partRakutHorizontalLine(),
      this.partRakutVerticalLine().translate($(this.rakutWidth, 0))
    );
    const bearings = {left: this.rakutBearing, right: this.bearing};
    const glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

  private get spaceWidth(): number {
    return (this.bowlWidth + this.thickness) * 0.5;
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