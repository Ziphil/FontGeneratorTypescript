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
  public partTopRightmostTip(): Part {
    let part = this.partTopLeftTipShape().reflectHor();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopCenterLeftTip(): Part {
    let part = this.partTopLeftTipShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.mean - this.verThickness));
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
  public partBottomRightmostTip(): Part {
    let part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partBottomCenterRightTip(): Part {
    let part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partTopCenterTipShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.horThickness, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopCenterTip(): Part {
    let part = this.partTopCenterTipShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomCenterTip(): Part {
    let part = this.partTopCenterTipShape().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  private get unbeakedTalWidth(): number {
    return this.bowlWidth * 0.85;
  }

  private get unbeakedBeakWidth(): number {
    return this.unbeakedTalWidth - this.bowlWidth + this.horThickness;
  }

  private get beakHeight(): number {
    return this.mean * this.config.beakRatio;
  }

  private get beakFixLength(): number {
    let beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      return -this.horThickness + this.unbeakedBeakWidth;
    } else {
      return 0;
    }
  }

  @part()
  public partTopLeftBeakShape(): Part {
    let beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness)),
        Part.line($(0, 0), $(this.unbeakedBeakWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.unbeakedBeakWidth, 0))
      );
      part.moveOrigin($(this.beakFixLength, 0));
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, this.beakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness + this.beakHeight)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftBeak(): Part {
    let part = this.partTopLeftBeakShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightBeak(): Part {
    let part = this.partTopLeftBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightmostBeak(): Part {
    let part = this.partTopLeftBeakShape().reflectHor();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftBeak(): Part {
    let part = this.partTopLeftBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightBeak(): Part {
    let part = this.partTopLeftBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightmostBeak(): Part {
    let part = this.partTopLeftBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
    return part;
  }

  private get shortBeakHeight(): number {
    let minGap = this.mean * 0.05;
    return Math.min(this.beakHeight * 0.6, (this.mean - this.verThickness * 3) / 2 - minGap);
  }

  @part()
  public partTopLeftShortBeakShape(): Part {
    let beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness)),
        Part.line($(0, 0), $(this.unbeakedBeakWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.unbeakedBeakWidth, 0))
      );
      part.moveOrigin($(this.beakFixLength, 0));
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, this.shortBeakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness + this.shortBeakHeight)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopRightShortBeak(): Part {
    let part = this.partTopLeftShortBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftShortBeak(): Part {
    let part = this.partTopLeftShortBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  private get legWidth(): number {
    return this.bowlWidth * this.config.legRatio;
  }

  @part()
  public partTopLeftLegShape(): Part {
    let legWidth = this.legWidth;
    if (legWidth === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness)),
        Part.line($(0, 0), $(this.horThickness, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.verThickness + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth + this.legWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.horThickness - this.legWidth, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftLeg(): Part {
    let part = this.partTopLeftLegShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightLeg(): Part {
    let part = this.partTopLeftLegShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftLeg(): Part {
    let part = this.partTopLeftLegShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightLeg(): Part {
    let part = this.partTopLeftLegShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightmostLeg(): Part {
    let part = this.partTopLeftLegShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
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
  public partHorBarShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.bowlWidth - this.horThickness * 2, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.bowlWidth + this.horThickness * 2, 0))
    );
    return part;
  }

  @part()
  public partTopHorBar(): Part {
    let part = this.partHorBarShape();
    part.moveOrigin($(-this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomHorBar(): Part {
    let part = this.partHorBarShape();
    part.moveOrigin($(-this.horThickness, 0));
    return part;
  }

  private get tongueWidth(): number {
    return this.bowlWidth * 0.85;
  }

  @part()
  public partTongueShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.tongueWidth, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.tongueWidth * 2, 0))
    );
    return part;
  }

  @part()
  public partTopTongue(): Part {
    let part = this.partTongueShape();
    part.moveOrigin($(this.tongueWidth - this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomTongue(): Part {
    let part = this.partTongueShape();
    part.moveOrigin($(0, 0));
    return part;
  }

  private get narrowBowlWidth(): number {
    return this.bowlWidth * 0.9;
  }

  @part()
  public partHorShortBarShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.narrowBowlWidth - this.horThickness * 2, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.narrowBowlWidth + this.horThickness * 2, 0))
    );
    return part;
  }

  @part()
  public partTopLeftHorShortBar(): Part {
    let part = this.partHorShortBarShape();
    part.moveOrigin($(-this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightHorShortBar(): Part {
    let part = this.partHorShortBarShape();
    part.moveOrigin($(-this.narrowBowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftHorShortBar(): Part {
    let part = this.partHorShortBarShape();
    part.moveOrigin($(-this.horThickness, 0));
    return part;
  }

  @part()
  public partBottomRightHorShortBar(): Part {
    let part = this.partHorShortBarShape();
    part.moveOrigin($(-this.narrowBowlWidth, 0));
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
  public partLeftVerBar(): Part {
    let part = this.partVerBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partRightVerBar(): Part {
    let part = this.partVerBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partCenterVerBar(): Part {
    let part = this.partVerBarShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partRightmostVerBar(): Part {
    let part = this.partVerBarShape();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness * 2, this.verThickness));
    return part;
  }

  @part()
  public partVerShortBarShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -(this.mean - this.verThickness * 3) / 2)),
      Part.line($(0, 0), $(this.horThickness, 0)),
      Part.line($(0, 0), $(0, (this.mean - this.verThickness * 3) / 2)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopLeftVerShortBar(): Part {
    let part = this.partVerShortBarShape();
    part.moveOrigin($(0, (this.mean + this.verThickness) / 2));
    return part;
  }

  @part()
  public partTopRightVerShortBar(): Part {
    let part = this.partVerShortBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, (this.mean + this.verThickness) / 2));
    return part;
  }

  @part()
  public partBottomLeftVerShortBar(): Part {
    let part = this.partVerShortBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightVerShortBar(): Part {
    let part = this.partVerShortBarShape();
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

  @part()
  public partWideTransphone(): Part {
    let part = this.partTransphoneShape();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness - this.transphoneGap, 0));
    return part;
  }

  @part()
  public partSolidusShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.verThickness)),
      Part.line($(0, 0), $(this.bowlWidth, 0)),
      Part.line($(0, 0), $(0, this.verThickness)),
      Part.line($(0, 0), $(-this.bowlWidth, 0))
    );
    return part;
  }

  @part()
  public partSolidus(): Part {
    let part = this.partSolidusShape();
    part.moveOrigin($(0, (this.mean - this.verThickness) / 2));
    return part;
  }

  private get diacriticHorThickness(): number {
    return this.horThickness * 0.85;
  }

  private get diacriticVerThickness(): number {
    return this.diacriticHorThickness * this.config.contrastRatio;
  }

  private get diacriticWidth(): number {
    return this.bowlWidth * 0.5;
  }

  private get diacriticGap(): number {
    return this.descent * 0.25;
  }

  @part()
  public partTopDiacriticShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.diacriticVerThickness)),
      Part.line($(0, 0), $(this.diacriticWidth, 0)),
      Part.line($(0, 0), $(0, this.diacriticVerThickness)),
      Part.line($(0, 0), $(-this.diacriticWidth, 0))
    );
    return part;
  }

  @part()
  public partTopDiacritic(): Part {
    let part = this.partTopDiacriticShape();
    part.moveOrigin($(-(this.bowlWidth - this.diacriticWidth) / 2, this.mean + this.diacriticGap));
    return part;
  }

  @part()
  public partBottomDiacritic(): Part {
    let part = this.partTopDiacriticShape().reflectVer();
    part.moveOrigin($(-(this.bowlWidth - this.diacriticWidth) / 2, -this.diacriticGap));
    return part;
  }

  private get dotWidth(): number {
    return this.horThickness;
  }

  private get dotHeight(): number {
    return this.verThickness;
  }

  private get dotGap(): number {
    return this.bowlWidth * 0.1;
  }

  @part()
  public partDotShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.dotHeight)),
      Part.line($(0, 0), $(this.dotWidth, 0)),
      Part.line($(0, 0), $(0, this.dotHeight)),
      Part.line($(0, 0), $(-this.dotWidth, 0))
    );
    return part;
  }

  @part()
  public partFirstDot(): Part {
    let part = this.partDotShape();
    part.moveOrigin($(0, 0));
    return part;
  }

  @part()
  public partSecondDot(): Part {
    let part = this.partDotShape();
    part.moveOrigin($(-this.dotWidth - this.dotGap, 0));
    return part;
  }

  private get badekGap(): number {
    return this.dotHeight;
  }

  @part()
  public partBadekStemShape(): Part {
    let part = Part.seq(
      Part.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap)),
      Part.line($(0, 0), $(this.horThickness, 0)),
      Part.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap)),
      Part.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partBadekStem(): Part {
    let part = this.partBadekStemShape();
    part.moveOrigin($((this.dotWidth - this.horThickness) / 2, this.dotHeight + this.badekGap));
    return part;
  }

  private get padekBendWidth(): number {
    return this.bowlWidth * this.config.padekBendRatio;
  }

  @part()
  public partPadekStemShape(): Part {
    let padekBendWidth = this.padekBendWidth;
    if (padekBendWidth === 0) {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap)),
        Part.line($(0, 0), $(this.horThickness, 0)),
        Part.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      let part = Part.seq(
        Part.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap + this.edgeHeight)),
        this.partTopLeftEdgeShape(),
        Part.line($(0, 0), $(this.horThickness - this.edgeWidth + this.padekBendWidth, 0)),
        Part.line($(0, 0), $(0, this.verThickness)),
        Part.line($(0, 0), $(-this.padekBendWidth, 0)),
        Part.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap - this.verThickness)),
        Part.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partPadekStem(): Part {
    let part = this.partPadekStemShape();
    part.moveOrigin($((this.dotWidth - this.horThickness) / 2, this.dotHeight + this.badekGap));
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
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("t", "T")
  public glyphTal(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightBeak(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar()
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
      this.partTopLeftBeak(),
      this.partTopRightTip(),
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partRightVerBar()
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
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
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
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
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
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
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
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
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
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("q", "Q")
  public glyphQol(): Glyph {
    let part = Part.union(
      this.glyphCal().toPart(),
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
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
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
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partRightVerBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("i", "I")
  public glyphIt(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTail(),
      this.partTopHorBar(),
      this.partLeftVerBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("o", "O")
  public glyphOt(): Glyph {
    let part = Part.union(
      this.partTopRightTail(),
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partTopTongue(),
      this.partBottomHorBar(),
      this.partRightVerBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("u", "U")
  public glyphUt(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTail(),
      this.partTopHorBar(),
      this.partBottomTongue(),
      this.partLeftVerBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("x", "X")
  public glyphXal(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightmostTip(),
      this.partTopCenterTip(),
      this.partBottomLeftTip(),
      this.partBottomRightmostTip(),
      this.partBottomCenterTip(),
      this.partLeftVerBar(),
      this.partCenterVerBar(),
      this.partRightmostVerBar(),
      this.partTopLeftHorShortBar(),
      this.partTopRightHorShortBar(),
      this.partBottomLeftHorShortBar(),
      this.partBottomRightHorShortBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("j", "J")
  public glyphJol(): Glyph {
    let part = Part.union(
      this.glyphXal().toPart(),
      this.partWideTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("m", "M")
  public glyphMes(): Glyph {
    let part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightmostTip(),
      this.partTopCenterLeftTip(),
      this.partBottomLeftTip(),
      this.partBottomRightmostLeg(),
      this.partBottomCenterRightTip(),
      this.partLeftVerBar(),
      this.partCenterVerBar(),
      this.partRightmostVerBar(),
      this.partTopRightHorShortBar(),
      this.partBottomLeftHorShortBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("n", "N")
  public glyphNes(): Glyph {
    let part = Part.union(
      this.glyphMes().toPart(),
      this.partWideTransphone()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("0")
  public glyphNuf(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partSolidus()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("1")
  public glyphTas(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightShortBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partBottomRightVerShortBar(),
      this.partSolidus()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("9")
  public glyphVun(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftShortBeak(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partRightVerBar(),
      this.partTopLeftVerShortBar(),
      this.partSolidus()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("2")
  public glyphQic(): Glyph {
    let part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partBottomLeftTail()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("6")
  public glyphLem(): Glyph {
    let part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partBottomRightTail()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("4")
  public glyphPav(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partTopLeftTail()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("8")
  public glyphKeq(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partTopRightTail()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("5")
  public glyphXef(): Glyph {
    let part = Part.union(
      this.partTopLeftBeak(),
      this.partTopRightmostBeak(),
      this.partTopCenterTip(),
      this.partBottomLeftBeak(),
      this.partBottomRightmostBeak(),
      this.partBottomCenterTip(),
      this.partCenterVerBar(),
      this.partTopLeftHorShortBar(),
      this.partTopRightHorShortBar(),
      this.partBottomLeftHorShortBar(),
      this.partBottomRightHorShortBar()
    );
    part.translate($(this.beakFixLength, 0));
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("3")
  public glyphYus(): Glyph {
    let part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightmostTip(),
      this.partTopCenterTip(),
      this.partBottomLeftTip(),
      this.partBottomRightmostLeg(),
      this.partBottomCenterTip(),
      this.partLeftVerBar(),
      this.partRightmostVerBar(),
      this.partCenterVerBar(),
      this.partTopLeftHorShortBar(),
      this.partTopRightHorShortBar(),
      this.partBottomLeftHorShortBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("7")
  public glyphSiz(): Glyph {
    let part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightmostTip(),
      this.partTopCenterTip(),
      this.partBottomLeftTip(),
      this.partBottomRightmostTip(),
      this.partBottomCenterTip(),
      this.partLeftVerBar(),
      this.partRightmostVerBar(),
      this.partCenterVerBar(),
      this.partTopRightHorShortBar(),
      this.partBottomLeftHorShortBar(),
      this.partBottomRightHorShortBar()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("á", "Á", "à", "À", "â", "Â")
  public glyphAtDiacritic(): Glyph {
    let part = Part.union(
      this.glyphAt().toPart(),
      this.partTopDiacritic()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("é", "É", "è", "È", "ê", "Ê")
  public glyphEtDiacritic(): Glyph {
    let part = Part.union(
      this.glyphEt().toPart(),
      this.partBottomDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("í", "Í", "ì", "Ì", "î", "Î")
  public glyphItDiacritic(): Glyph {
    let part = Part.union(
      this.glyphIt().toPart(),
      this.partTopDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ó", "Ó", "ò", "Ò", "ô", "Ô")
  public glyphOtDiacritic(): Glyph {
    let part = Part.union(
      this.glyphOt().toPart(),
      this.partBottomDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ú", "Ú", "ù", "Ù", "û", "Û")
  public glyphUtDiacritic(): Glyph {
    let part = Part.union(
      this.glyphUt().toPart(),
      this.partTopDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph(",")
  public glyphTadek(): Glyph {
    let part = Part.union(
      this.partFirstDot()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph(".")
  public glyphDek(): Glyph {
    let part = Part.union(
      this.partFirstDot(),
      this.partSecondDot()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("!")
  public glyphBadek(): Glyph {
    let part = Part.union(
      this.partFirstDot(),
      this.partSecondDot(),
      this.partBadekStem()
    );
    let glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("?")
  public glyphPadek(): Glyph {
    let part = Part.union(
      this.partFirstDot(),
      this.partSecondDot(),
      this.partPadekStem()
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
  beakRatio: number,
  legRatio: number,
  tailRatio: number,
  padekBendRatio: number,
  edgeJoin: KalegEdgeJoin
};
export type KalegEdgeJoin = "miter" | "bevel" | "round";