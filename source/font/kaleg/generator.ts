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

  private get horThickness(): number {
    return this.config.weightConst * 100;
  }

  private get verThickness(): number {
    return this.horThickness * this.config.contrastRatio;
  }

  private get bowlWidth(): number {
    return this.mean * this.config.bowlRatio;
  }

  private get edgeWidth(): number {
    return this.horThickness * this.config.edgeRatio;
  }

  private get edgeHeight(): number {
    return this.edgeWidth * this.config.edgeContrastRatio;
  }

  @part()
  public partTopLeftEdgeShape(): Part {
    let edgeJoin = this.config.edgeJoin;
    if (edgeJoin === "miter") {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.edgeHeight)),
        Part.line($(0, 0), $(this.edgeWidth, 0))
      );
      return part;
    } else if (edgeJoin === "bevel") {
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

  private get unbeakedTalWidth(): number {
    return this.bowlWidth * 0.85;
  }

  private get unbeakedVerBeakWidth(): number {
    return this.unbeakedTalWidth - this.bowlWidth + this.horThickness;
  }

  private get verBeakHeight(): number {
    return this.mean * this.config.verBeakRatio;
  }

  private get beakFixLength(): number {
    let verBeakHeight = this.verBeakHeight;
    if (verBeakHeight === 0) {
      return -this.horThickness + this.unbeakedVerBeakWidth;
    } else {
      return 0;
    }
  }

  @part()
  public partTopLeftVerBeakShape(): Part {
    let verBeakHeight = this.verBeakHeight;
    if (verBeakHeight === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness)),
        Part.line($(0, 0), $(this.unbeakedVerBeakWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.unbeakedVerBeakWidth, 0))
      );
      part.moveOrigin($(this.beakFixLength, 0));
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, this.verBeakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness + this.verBeakHeight)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftVerBeak(): Part {
    let part = this.partTopLeftVerBeakShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightVerBeak(): Part {
    let part = this.partTopLeftVerBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftVerBeak(): Part {
    let part = this.partTopLeftVerBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightVerBeak(): Part {
    let part = this.partTopLeftVerBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  private get horBeakWidth(): number {
    return this.bowlWidth * this.config.horBeakRatio;
  }

  @part()
  public partTopLeftHorBeakShape(): Part {
    let horBeakWidth = this.horBeakWidth;
    if (horBeakWidth === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness)),
        Part.line($(0, 0), $(this.horThickness, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, this.verBeakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth + this.horBeakWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.horThickness - this.horBeakWidth, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftHorBeak(): Part {
    let part = this.partTopLeftHorBeakShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightHorBeak(): Part {
    let part = this.partTopLeftHorBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftHorBeak(): Part {
    let part = this.partTopLeftHorBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightHorBeak(): Part {
    let part = this.partTopLeftHorBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  private get tailWidth(): number {
    return this.bowlWidth * this.config.tailRatio;
  }

  @part()
  public partTopLeftTailShape(): Part {
    let tailWidth = this.tailWidth;
    if (tailWidth === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness - this.descent)),
        Part.line($(0, 0), $(this.horThickness, 0)),
        Part.line($(0, 0), $(0, this.verThickness + this.descent)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness - this.descent + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth + this.tailWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.tailWidth, 0)),
        Part.line($(0, 0), $(0, this.descent)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftTail(): Part {
    let part = this.partTopLeftTailShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightTail(): Part {
    let part = this.partTopLeftTailShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftTail(): Part {
    let part = this.partTopLeftTailShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightTail(): Part {
    let part = this.partTopLeftTailShape().reflectHor().reflectVer();
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
  public partVerBarShape(): Part {
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
    let part = this.partVerBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partRightBar(): Part {
    let part = this.partVerBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  private get transphoneThicknessRatio(): number {
    return 0.92;
  }

  private get transphoneGap(): number {
    return this.bearing * 2;
  }

  @part()
  public partTransphoneShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.mean)),
      Part.line($(0, 0), $(this.horThickness * this.transphoneThicknessRatio, 0)),
      Part.line($(0, 0), $(0, this.mean)),
      Part.line($(0, 0), $(-this.horThickness * this.transphoneThicknessRatio, 0))
    );
    return part;
  }

  @part()
  public partTransphone(): Part {
    let part = this.partTransphoneShape();
    part.moveOrigin($(-this.bowlWidth - this.transphoneGap, 0));
    return part;
  }

  private createBearings(): Bearings {
    let left = this.bearing;
    let right = this.bearing;
    let bearings = {left, right};
    return bearings;
  }

  @glyph("a", "A")
  public glyphAt(): Glyph {
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
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("t", "T")
  public glyphTal(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightVerBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightVerBeak(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("d", "D")
  public glyphDol(): Glyph {
    let part = Part.union(
      this.glyphTal().toPart(),
      this.partTransphone().translate($(this.beakFixLength, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("f", "F")
  public glyphFal(): Glyph {
    let part = Part.union(
      this.partTopLeftVerBeak(),
      this.partTopRightTip(),
      this.partBottomLeftVerBeak(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partRightBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("v", "V")
  public glyphVol(): Glyph {
    let part = Part.union(
      this.glyphFal().toPart(),
      this.partTransphone().translate($(this.beakFixLength, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("s", "S")
  public glyphSal(): Glyph {
    let part = Part.union(
      this.partTopLeftHorBeak(),
      this.partTopRightHorBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("z", "Z")
  public glyphZol(): Glyph {
    let part = Part.union(
      this.glyphSal().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("y", "Y")
  public glyphYes(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftHorBeak(),
      this.partBottomRightHorBeak(),
      this.partTopBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("h", "H")
  public glyphHes(): Glyph {
    let part = Part.union(
      this.glyphYes().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("p", "P")
  public glyphPal(): Glyph {
    let part = Part.union(
      this.partTopLeftTail(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("b", "B")
  public glyphBol(): Glyph {
    let part = Part.union(
      this.glyphPal().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("k", "K")
  public glyphKal(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTail(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("g", "G")
  public glyphGol(): Glyph {
    let part = Part.union(
      this.glyphKal().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("c", "C")
  public glyphCal(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTail(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("q", "Q")
  public glyphQol(): Glyph {
    let part = Part.union(
      this.glyphPal().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("l", "L")
  public glyphLes(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTail(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar(),
      this.partRightBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("r", "R")
  public glyphRes(): Glyph {
    let part = Part.union(
      this.glyphLes().toPart(),
      this.partTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("e", "E")
  public glyphEt(): Glyph {
    let part = Part.union(
      this.partTopRightTail(),
      this.partBottomLeftVerBeak(),
      this.partBottomRightTip(),
      this.partBottomBar(),
      this.partRightBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("i", "I")
  public glyphIt(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightVerBeak(),
      this.partBottomLeftTail(),
      this.partTopBar(),
      this.partLeftBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("o", "O")
  public glyphOt(): Glyph {
    let part = Part.union(
      this.partTopRightTail(),
      this.partBottomLeftVerBeak(),
      this.partBottomRightTip(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partRightBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("u", "U")
  public glyphUt(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightVerBeak(),
      this.partBottomLeftTail(),
      this.partTopBar(),
      this.partBottomBar(),
      this.partLeftBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get spaceWidth(): number {
    return this.bowlWidth * 0.7;
  }

  @glyph(" ")
  public glyphSpace(): Glyph {
    let part = Part.empty();
    let bearings = {left: this.spaceWidth, right: 0};
    let glyph = Glyph.byBearings(part, bearings);
    return glyph;
  }

}


export type KalegConfig = {
  weightConst: number,
  contrastRatio: number,
  edgeRatio: number,
  edgeContrastRatio: number,
  bowlRatio: number,
  verBeakRatio: number,
  horBeakRatio: number,
  tailRatio: number,
  edgeJoin: KalegEdgeJoin
};
export type KalegEdgeJoin = "miter" | "bevel" | "round";