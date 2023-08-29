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


@generator()
export class KalegGenerator extends Generator<KalegConfig> {

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
  public contourTopLeftEdgeShape(): Contour {
    const edgeJoin = this.config.edgeJoin;
    if (edgeJoin === "miter") {
      const contour = Contour.seq(
        Contour.line($(0, 0), $(0, -this.edgeHeight)),
        Contour.line($(0, 0), $(this.edgeWidth, 0))
      );
      return contour;
    } else if (edgeJoin === "bevel") {
      const contour = Contour.seq(
        Contour.line($(0, 0), $(this.edgeWidth, -this.edgeHeight))
      );
      return contour;
    } else {
      const contour = Contour.seq(
        Contour.arc($(this.edgeWidth, 0), this.edgeWidth, -180, -90).scale(1, this.edgeHeight / this.edgeWidth)
      );
      return contour;
    }
  }

  @part()
  public partTopLeftTipShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness + this.edgeHeight)),
      this.contourTopLeftEdgeShape(),
      Contour.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopLeftTip(): Part {
    const part = this.partTopLeftTipShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightTip(): Part {
    const part = this.partTopLeftTipShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightmostTip(): Part {
    const part = this.partTopLeftTipShape().reflectHor();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopCenterLeftTip(): Part {
    const part = this.partTopLeftTipShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftTip(): Part {
    const part = this.partTopLeftTipShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightTip(): Part {
    const part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightmostTip(): Part {
    const part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partBottomCenterRightTip(): Part {
    const part = this.partTopLeftTipShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partTopCenterTipShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness)),
      Contour.line($(0, 0), $(this.horThickness, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopCenterTip(): Part {
    const part = this.partTopCenterTipShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomCenterTip(): Part {
    const part = this.partTopCenterTipShape().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  private get unbeakedTalWidth(): number {
    return this.bowlWidth * this.config.unbeakedTalRatio;
  }

  private get unbeakedBeakWidth(): number {
    return this.unbeakedTalWidth - this.bowlWidth + this.horThickness;
  }

  private get beakHeight(): number {
    return this.mean * this.config.beakRatio;
  }

  private get beakFixLength(): number {
    const beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      return -this.horThickness + this.unbeakedBeakWidth;
    } else {
      return 0;
    }
  }

  @part()
  public partTopLeftBeakShape(): Part {
    const beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness)),
        Contour.line($(0, 0), $(this.unbeakedBeakWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.unbeakedBeakWidth, 0))
      );
      part.moveOrigin($(this.beakFixLength, 0));
      return part;
    } else {
      const part = Part.seq(
        Contour.line($(0, this.beakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.contourTopLeftEdgeShape(),
        Contour.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness + this.beakHeight)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftBeak(): Part {
    const part = this.partTopLeftBeakShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightBeak(): Part {
    const part = this.partTopLeftBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightmostBeak(): Part {
    const part = this.partTopLeftBeakShape().reflectHor();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftBeak(): Part {
    const part = this.partTopLeftBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightBeak(): Part {
    const part = this.partTopLeftBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightmostBeak(): Part {
    const part = this.partTopLeftBeakShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
    return part;
  }

  private get shortBeakHeight(): number {
    const minGap = this.mean * 0.05;
    return Math.min(this.beakHeight * 0.6, (this.mean - this.verThickness * 3) / 2 - minGap);
  }

  @part()
  public partTopLeftShortBeakShape(): Part {
    const beakHeight = this.beakHeight;
    if (beakHeight === 0) {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness)),
        Contour.line($(0, 0), $(this.unbeakedBeakWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.unbeakedBeakWidth, 0))
      );
      part.moveOrigin($(this.beakFixLength, 0));
      return part;
    } else {
      const part = Part.seq(
        Contour.line($(0, this.shortBeakHeight), $(0, -this.verThickness + this.edgeHeight)),
        this.contourTopLeftEdgeShape(),
        Contour.line($(0, 0), $(this.horThickness - this.edgeWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness + this.shortBeakHeight)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopRightShortBeak(): Part {
    const part = this.partTopLeftShortBeakShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftShortBeak(): Part {
    const part = this.partTopLeftShortBeakShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  private get legWidth(): number {
    return this.bowlWidth * this.config.legRatio;
  }

  @part()
  public partTopLeftLegShape(): Part {
    const legWidth = this.legWidth;
    if (legWidth === 0) {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness)),
        Contour.line($(0, 0), $(this.horThickness, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness + this.edgeHeight)),
        this.contourTopLeftEdgeShape(),
        Contour.line($(0, 0), $(this.horThickness - this.edgeWidth + this.legWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.horThickness - this.legWidth, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftLeg(): Part {
    const part = this.partTopLeftLegShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightLeg(): Part {
    const part = this.partTopLeftLegShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftLeg(): Part {
    const part = this.partTopLeftLegShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightLeg(): Part {
    const part = this.partTopLeftLegShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightmostLeg(): Part {
    const part = this.partTopLeftLegShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness, this.verThickness));
    return part;
  }

  private get tailWidth(): number {
    return this.bowlWidth * this.config.tailRatio;
  }

  @part()
  public partTopLeftTailShape(): Part {
    const tailWidth = this.tailWidth;
    if (tailWidth === 0) {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness - this.descent)),
        Contour.line($(0, 0), $(this.horThickness, 0)),
        Contour.line($(0, 0), $(0, this.verThickness + this.descent)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.verThickness - this.descent + this.edgeHeight)),
        this.contourTopLeftEdgeShape(),
        Contour.line($(0, 0), $(this.horThickness - this.edgeWidth + this.tailWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.tailWidth, 0)),
        Contour.line($(0, 0), $(0, this.descent)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partTopLeftTail(): Part {
    const part = this.partTopLeftTailShape();
    part.moveOrigin($(0, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightTail(): Part {
    const part = this.partTopLeftTailShape().reflectHor();
    part.moveOrigin($(-this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftTail(): Part {
    const part = this.partTopLeftTailShape().reflectVer();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightTail(): Part {
    const part = this.partTopLeftTailShape().reflectHor().reflectVer();
    part.moveOrigin($(-this.bowlWidth, this.verThickness));
    return part;
  }

  @part()
  public partHorBarShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness)),
      Contour.line($(0, 0), $(this.bowlWidth - this.horThickness * 2, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.bowlWidth + this.horThickness * 2, 0))
    );
    return part;
  }

  @part()
  public partTopHorBar(): Part {
    const part = this.partHorBarShape();
    part.moveOrigin($(-this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomHorBar(): Part {
    const part = this.partHorBarShape();
    part.moveOrigin($(-this.horThickness, 0));
    return part;
  }

  private get tongueWidth(): number {
    return this.unbeakedTalWidth;
  }

  @part()
  public partTongueShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness)),
      Contour.line($(0, 0), $(this.tongueWidth, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.tongueWidth * 2, 0))
    );
    return part;
  }

  @part()
  public partTopTongue(): Part {
    const part = this.partTongueShape();
    part.moveOrigin($(this.tongueWidth - this.bowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomTongue(): Part {
    const part = this.partTongueShape();
    part.moveOrigin($(0, 0));
    return part;
  }

  private get narrowBowlWidth(): number {
    return this.bowlWidth * this.config.narrowBowlRatio;
  }

  @part()
  public partHorShortBarShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness)),
      Contour.line($(0, 0), $(this.narrowBowlWidth - this.horThickness * 2, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.narrowBowlWidth + this.horThickness * 2, 0))
    );
    return part;
  }

  @part()
  public partTopLeftHorShortBar(): Part {
    const part = this.partHorShortBarShape();
    part.moveOrigin($(-this.horThickness, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partTopRightHorShortBar(): Part {
    const part = this.partHorShortBarShape();
    part.moveOrigin($(-this.narrowBowlWidth, this.mean - this.verThickness));
    return part;
  }

  @part()
  public partBottomLeftHorShortBar(): Part {
    const part = this.partHorShortBarShape();
    part.moveOrigin($(-this.horThickness, 0));
    return part;
  }

  @part()
  public partBottomRightHorShortBar(): Part {
    const part = this.partHorShortBarShape();
    part.moveOrigin($(-this.narrowBowlWidth, 0));
    return part;
  }

  @part()
  public partVerBarShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.mean + this.verThickness * 2)),
      Contour.line($(0, 0), $(this.horThickness, 0)),
      Contour.line($(0, 0), $(0, this.mean - this.verThickness * 2)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partLeftVerBar(): Part {
    const part = this.partVerBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partRightVerBar(): Part {
    const part = this.partVerBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partCenterVerBar(): Part {
    const part = this.partVerBarShape();
    part.moveOrigin($(-this.narrowBowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  @part()
  public partRightmostVerBar(): Part {
    const part = this.partVerBarShape();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness * 2, this.verThickness));
    return part;
  }

  @part()
  public partVerShortBarShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -(this.mean - this.verThickness * 3) / 2)),
      Contour.line($(0, 0), $(this.horThickness, 0)),
      Contour.line($(0, 0), $(0, (this.mean - this.verThickness * 3) / 2)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partTopLeftVerShortBar(): Part {
    const part = this.partVerShortBarShape();
    part.moveOrigin($(0, (this.mean + this.verThickness) / 2));
    return part;
  }

  @part()
  public partTopRightVerShortBar(): Part {
    const part = this.partVerShortBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, (this.mean + this.verThickness) / 2));
    return part;
  }

  @part()
  public partBottomLeftVerShortBar(): Part {
    const part = this.partVerShortBarShape();
    part.moveOrigin($(0, this.verThickness));
    return part;
  }

  @part()
  public partBottomRightVerShortBar(): Part {
    const part = this.partVerShortBarShape();
    part.moveOrigin($(-this.bowlWidth + this.horThickness, this.verThickness));
    return part;
  }

  private get transphoneThicknessRatio(): number {
    return 1;
  }

  private get transphoneGap(): number {
    return this.bearing * 2;
  }

  @part()
  public partTransphoneShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.mean)),
      Contour.line($(0, 0), $(this.horThickness * this.transphoneThicknessRatio, 0)),
      Contour.line($(0, 0), $(0, this.mean)),
      Contour.line($(0, 0), $(-this.horThickness * this.transphoneThicknessRatio, 0))
    );
    return part;
  }

  @part()
  public partTransphone(): Part {
    const part = this.partTransphoneShape();
    part.moveOrigin($(-this.bowlWidth - this.transphoneGap, 0));
    return part;
  }

  @part()
  public partWideTransphone(): Part {
    const part = this.partTransphoneShape();
    part.moveOrigin($(-this.narrowBowlWidth * 2 + this.horThickness - this.transphoneGap, 0));
    return part;
  }

  @part()
  public partSolidusShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.verThickness)),
      Contour.line($(0, 0), $(this.bowlWidth, 0)),
      Contour.line($(0, 0), $(0, this.verThickness)),
      Contour.line($(0, 0), $(-this.bowlWidth, 0))
    );
    return part;
  }

  @part()
  public partSolidus(): Part {
    const part = this.partSolidusShape();
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
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.diacriticVerThickness)),
      Contour.line($(0, 0), $(this.diacriticWidth, 0)),
      Contour.line($(0, 0), $(0, this.diacriticVerThickness)),
      Contour.line($(0, 0), $(-this.diacriticWidth, 0))
    );
    return part;
  }

  @part()
  public partTopDiacritic(): Part {
    const part = this.partTopDiacriticShape();
    part.moveOrigin($(-(this.bowlWidth - this.diacriticWidth) / 2, this.mean + this.diacriticGap));
    return part;
  }

  @part()
  public partBottomDiacritic(): Part {
    const part = this.partTopDiacriticShape().reflectVer();
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
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.dotHeight)),
      Contour.line($(0, 0), $(this.dotWidth, 0)),
      Contour.line($(0, 0), $(0, this.dotHeight)),
      Contour.line($(0, 0), $(-this.dotWidth, 0))
    );
    return part;
  }

  @part()
  public partFirstDot(): Part {
    const part = this.partDotShape();
    part.moveOrigin($(0, 0));
    return part;
  }

  @part()
  public partSecondDot(): Part {
    const part = this.partDotShape();
    part.moveOrigin($(-this.dotWidth - this.dotGap, 0));
    return part;
  }

  private get badekGap(): number {
    return this.dotHeight;
  }

  @part()
  public partBadekStemShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap)),
      Contour.line($(0, 0), $(this.horThickness, 0)),
      Contour.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partBadekStem(): Part {
    const part = this.partBadekStemShape();
    part.moveOrigin($((this.dotWidth - this.horThickness) / 2, this.dotHeight + this.badekGap));
    return part;
  }

  private get padekBendWidth(): number {
    return this.bowlWidth * this.config.padekBendRatio;
  }

  @part()
  public partPadekStemShape(): Part {
    const padekBendWidth = this.padekBendWidth;
    if (padekBendWidth === 0) {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap)),
        Contour.line($(0, 0), $(this.horThickness, 0)),
        Contour.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    } else {
      const part = Part.seq(
        Contour.line($(0, 0), $(0, -this.mean - this.descent + this.dotHeight + this.badekGap + this.edgeHeight)),
        this.contourTopLeftEdgeShape(),
        Contour.line($(0, 0), $(this.horThickness - this.edgeWidth + this.padekBendWidth, 0)),
        Contour.line($(0, 0), $(0, this.verThickness)),
        Contour.line($(0, 0), $(-this.padekBendWidth, 0)),
        Contour.line($(0, 0), $(0, this.mean + this.descent - this.dotHeight - this.badekGap - this.verThickness)),
        Contour.line($(0, 0), $(-this.horThickness, 0))
      );
      return part;
    }
  }

  @part()
  public partPadekStem(): Part {
    const part = this.partPadekStemShape();
    part.moveOrigin($((this.dotWidth - this.horThickness) / 2, this.dotHeight + this.badekGap));
    return part;
  }

  private get nokHeight(): number {
    return (this.mean + this.descent) * 0.3;
  }

  @part()
  public partNokShape(): Part {
    const part = Part.seq(
      Contour.line($(0, 0), $(0, -this.nokHeight)),
      Contour.line($(0, 0), $(this.horThickness, 0)),
      Contour.line($(0, 0), $(0, this.nokHeight)),
      Contour.line($(0, 0), $(-this.horThickness, 0))
    );
    return part;
  }

  @part()
  public partNok(): Part {
    const part = this.partNokShape();
    part.moveOrigin($(0, this.mean + this.descent - this.nokHeight));
    return part;
  }

  private createBearings(): Bearings {
    const left = this.bearing;
    const right = this.bearing;
    const bearings = {left, right};
    return bearings;
  }

  @glyph("a", "A")
  public glyphAt(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("t", "T")
  public glyphTal(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTip(),
      this.partBottomRightBeak(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("d", "D")
  public glyphDol(): Glyph {
    const part = Part.union(
      this.glyphTal().toPart(),
      this.partTransphone().translate($(this.beakFixLength, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("f", "F")
  public glyphFal(): Glyph {
    const part = Part.union(
      this.partTopLeftBeak(),
      this.partTopRightTip(),
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partRightVerBar()
    );
    part.translate($(this.beakFixLength, 0));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("v", "V")
  public glyphVol(): Glyph {
    const part = Part.union(
      this.glyphFal().toPart(),
      this.partTransphone().translate($(this.beakFixLength, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("s", "S")
  public glyphSal(): Glyph {
    const part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("z", "Z")
  public glyphZol(): Glyph {
    const part = Part.union(
      this.glyphSal().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("y", "Y")
  public glyphYes(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("h", "H")
  public glyphHes(): Glyph {
    const part = Part.union(
      this.glyphYes().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("p", "P")
  public glyphPal(): Glyph {
    const part = Part.union(
      this.partTopLeftTail(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("b", "B")
  public glyphBol(): Glyph {
    const part = Part.union(
      this.glyphPal().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("k", "K")
  public glyphKal(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTail(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("g", "G")
  public glyphGol(): Glyph {
    const part = Part.union(
      this.glyphKal().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("c", "C")
  public glyphCal(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTail(),
      this.partBottomRightTip(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("q", "Q")
  public glyphQol(): Glyph {
    const part = Part.union(
      this.glyphCal().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("l", "L")
  public glyphLes(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftTip(),
      this.partBottomRightTail(),
      this.partTopHorBar(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("r", "R")
  public glyphRes(): Glyph {
    const part = Part.union(
      this.glyphLes().toPart(),
      this.partTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("e", "E")
  public glyphEt(): Glyph {
    const part = Part.union(
      this.partTopRightTail(),
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partRightVerBar()
    );
    part.translate($(this.beakFixLength, 0));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("i", "I")
  public glyphIt(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTail(),
      this.partTopHorBar(),
      this.partLeftVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("o", "O")
  public glyphOt(): Glyph {
    const part = Part.union(
      this.partTopRightTail(),
      this.partBottomLeftBeak(),
      this.partBottomRightTip(),
      this.partTopTongue(),
      this.partBottomHorBar(),
      this.partRightVerBar()
    );
    part.translate($(this.beakFixLength, 0));
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("u", "U")
  public glyphUt(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightBeak(),
      this.partBottomLeftTail(),
      this.partTopHorBar(),
      this.partBottomTongue(),
      this.partLeftVerBar()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("x", "X")
  public glyphXal(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("j", "J")
  public glyphJol(): Glyph {
    const part = Part.union(
      this.glyphXal().toPart(),
      this.partWideTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("n", "N")
  public glyphNes(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("m", "M")
  public glyphMes(): Glyph {
    const part = Part.union(
      this.glyphNes().toPart(),
      this.partWideTransphone()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("w", "W")
  public glyphTransphone(): Glyph {
    const part = Part.union(
      this.partTransphone().translate($(-this.bowlWidth - this.transphoneGap, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("0")
  public glyphNuf(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("1")
  public glyphTas(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("9")
  public glyphVun(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("2")
  public glyphQic(): Glyph {
    const part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partBottomLeftTail()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("6")
  public glyphLem(): Glyph {
    const part = Part.union(
      this.partTopLeftLeg(),
      this.partTopRightLeg(),
      this.partBottomLeftTip(),
      this.partBottomRightTip(),
      this.partBottomHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partBottomRightTail()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("4")
  public glyphPav(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partTopLeftTail()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("8")
  public glyphKeq(): Glyph {
    const part = Part.union(
      this.partTopLeftTip(),
      this.partTopRightTip(),
      this.partBottomLeftLeg(),
      this.partBottomRightLeg(),
      this.partTopHorBar(),
      this.partLeftVerBar(),
      this.partRightVerBar(),
      this.partTopRightTail()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("5")
  public glyphXef(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("3")
  public glyphYus(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("7")
  public glyphSiz(): Glyph {
    const part = Part.union(
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
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("á", "Á", "à", "À", "â", "Â")
  public glyphAtDiacritic(): Glyph {
    const part = Part.union(
      this.glyphAt().toPart(),
      this.partTopDiacritic()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("é", "É", "è", "È", "ê", "Ê")
  public glyphEtDiacritic(): Glyph {
    const part = Part.union(
      this.glyphEt().toPart(),
      this.partBottomDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("í", "Í", "ì", "Ì", "î", "Î")
  public glyphItDiacritic(): Glyph {
    const part = Part.union(
      this.glyphIt().toPart(),
      this.partTopDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ó", "Ó", "ò", "Ò", "ô", "Ô")
  public glyphOtDiacritic(): Glyph {
    const part = Part.union(
      this.glyphOt().toPart(),
      this.partBottomDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("ú", "Ú", "ù", "Ù", "û", "Û")
  public glyphUtDiacritic(): Glyph {
    const part = Part.union(
      this.glyphUt().toPart(),
      this.partTopDiacritic().translate($(this.beakFixLength / 2, 0))
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph(",")
  public glyphTadek(): Glyph {
    const part = Part.union(
      this.partFirstDot()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph(".")
  public glyphDek(): Glyph {
    const part = Part.union(
      this.partFirstDot(),
      this.partSecondDot()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("!")
  public glyphBadek(): Glyph {
    const part = Part.union(
      this.partFirstDot(),
      this.partSecondDot(),
      this.partBadekStem()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("?")
  public glyphPadek(): Glyph {
    const part = Part.union(
      this.partFirstDot(),
      this.partSecondDot(),
      this.partPadekStem()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  @glyph("'")
  public glyphNok(): Glyph {
    const part = Part.union(
      this.partNok()
    );
    const glyph = Glyph.byBearings(part, this.createBearings());
    return glyph;
  }

  private get spaceWidth(): number {
    return this.bowlWidth * 0.7;
  }

  @glyph(" ")
  public glyphSpace(): Glyph {
    const part = Part.empty();
    const bearings = {left: this.spaceWidth, right: 0};
    const glyph = Glyph.byBearings(part, bearings);
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
  narrowBowlRatio: number,
  unbeakedTalRatio: number,
  padekBendRatio: number,
  edgeJoin: KalegEdgeJoin
};
export type KalegEdgeJoin = "miter" | "bevel" | "round";