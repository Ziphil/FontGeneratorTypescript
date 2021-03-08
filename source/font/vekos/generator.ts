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
export class VekosGenerator extends Generator<VekosConfig> {

  private readonly descent: number = 250;
  private readonly mean: number = 500;
  private readonly extraDescent: number = 40;
  private readonly extraAscent: number = 10;
  private readonly overshoot: number = 10;

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
    return (this.config.weightConst * 80 + 370) * this.config.stretchConst;
  }

  // k, p, c, l, a などの文字に共通する丸い部分の外側の曲線の 4 分の 1 を、左端から上端への向きで生成します。
  @part()
  public partOuterBowl(): Part {
    let width = this.bowlWidth / 2;
    let height = this.mean / 2 + this.overshoot;
    let leftHandle = height * 0.1;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -leftHandle), $(-topHandle, 0), $(width, -height));
    return part;
  }

  // k, p, c, l, a などの文字に共通する丸い部分の内側の曲線の 4 分の 1 を、左端から上端への向きで生成します。
  @part()
  public partInnerBowl(): Part {
    let width = this.bowlWidth / 2 - this.horThickness;
    let height = this.mean / 2 - this.verThickness + this.overshoot;
    let leftHandle = height * 0.1;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -leftHandle), $(-topHandle, 0), $(width, -height));
    return part;
  }

  // k, p, c, l, a などの文字に共通する丸い部分を生成します。
  // 原点は全体の中央にあるので、回転や反転で変化しません。
  @part()
  public partBowl(): Part {
    let outerPart = Part.seq(
      this.partOuterBowl().reflectVerZero(),
      this.partOuterBowl().rotateHalfTurnZero().reverseZero(),
      this.partOuterBowl().reflectHorZero(),
      this.partOuterBowl().reverseZero()
    );
    let innerPart = Part.seq(
      this.partInnerBowl().reflectVerZero(),
      this.partInnerBowl().rotateHalfTurnZero().reverseZero(),
      this.partInnerBowl().reflectHorZero(),
      this.partInnerBowl().reverseZero()
    );
    let part = Part.stack(
      outerPart,
      innerPart.reverseZero().translate($(this.horThickness, 0))
    );
    part.moveZeroTo($(this.bowlWidth / 2, 0));
    return part;
  }

  // l の文字のディセンダー部分について、その先端の中央と上にある丸い部分の右端との水平距離を表します。
  private get lesTailBend(): number {
    return this.bowlWidth * 0.6;
  }

  private get lesTailCorrection(): number {
    return this.horThickness * 0.3;
  }

  private calcIdealThickness(angle: number): number {
    let horWeight = angle / 90;
    let verWeight = 1 - angle / 90;
    if (angle >= 0 && angle <= 90) {
      return horWeight * this.horThickness + verWeight * this.verThickness;
    } else {
      return 1 / 0;
    }
  }

  private calcTailError(innerHandle: number, outerHandle: number, bend: number, height: number): number {
    let path = PathUtil.bezier($(0, 0), $(0, innerHandle), $(0, -outerHandle), $(-bend, height));
    let basePoint = $(-bend / 2 + this.horThickness / 2, height / 2);
    let nearestPoint = path.getNearestPoint(basePoint);
    let angle = nearestPoint.subtract(basePoint).getAngle($(1, 0)) - 90;
    let error = Math.abs(nearestPoint.getDistance(basePoint) - this.calcIdealThickness(angle) / 2);
    return error;
  }

  private searchTailInnerHandle(outerHandle: number, bend: number, height: number): number {
    let interval = 0.5;
    let resultHandle = 0;
    let minimumError = 10000;
    for (let innerHandle = 0 ; innerHandle <= height ; innerHandle += interval) {
      let error = this.calcTailError(innerHandle, outerHandle, bend, height);
      if (error < minimumError) {
        minimumError = error;
        resultHandle = innerHandle;
      }
    }
    return resultHandle;
  }

  // l の文字のディセンダーの左側の曲線を、上端から下端への向きで生成します。
  @part()
  public partLeftLesTail(): Part {
    let bend = this.lesTailBend - this.horThickness / 2 + this.lesTailCorrection;
    let virtualBend = this.lesTailBend;
    let height = this.mean / 2 + this.descent;
    let bottomHandle = this.descent * 1.08;
    let topHandle = this.searchTailInnerHandle(bottomHandle, virtualBend, height);
    let part = Part.bezier($(0, 0), $(0, topHandle), $(0, -bottomHandle), $(-bend, height));
    return part;
  }

  // l の文字のディセンダーの右側の曲線を、上端から下端への向きで生成します。
  @part()
  public partRightLesTail(): Part {
    let bend = this.lesTailBend - this.horThickness / 2;
    let height = this.mean / 2 + this.descent;
    let topHandle = this.descent * 1.08;
    let bottomHandle = this.searchTailInnerHandle(topHandle, bend, height);
    let part = Part.bezier($(0, 0), $(0, topHandle), $(0, -bottomHandle), $(-bend, height));
    return part;
  }

  // 文字の書き始めや書き終わりの位置にある水平に切られた部分を、左端から右端への向きで生成します。
  @part()
  public partCut(): Part {
    let part = Part.line($(0, 0), $(this.horThickness, 0));
    return part;
  }

  // l の文字のディセンダーを生成します。
  // 反転や回転を施すことで、c などの文字のディセンダーや k, p などの文字のアセンダーとしても使えます。
  // 丸い部分と重ねたときに重なった部分が太く見えすぎないように、左側を少し細く補正してあります。
  // 原点は補正がないとしたときの左上の角にあります。
  @part()
  public partLesTail(): Part {
    let part = Part.seq(
      this.partLeftLesTail(),
      this.partCut(),
      this.partRightLesTail().reverseZero(),
      Part.line($(0, 0), $(-this.horThickness + this.lesTailCorrection, 0))
    );
    part.moveZeroTo($(-this.lesTailCorrection, 0));
    return part;
  }

  // l の文字と同じ形を生成します。
  // 原点は丸い部分の中央にあるので、回転や反転で変化しません。
  @part()
  public partLes(): Part {
    let part = Part.union(
      this.partBowl(),
      this.partLesTail().translate($(this.bowlWidth / 2 - this.horThickness, 0))
    );
    return part;
  }

  @glyph("l", "L")
  public glyphLes(): Glyph {
    let part = Part.union(
      this.partLes().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  // y の文字の下半分の内側に曲がる部分について、その最下部の外側の端と丸い部分の端との水平距離を表します。
  // 曲線の外側の曲がり具合を指定しているので、線の太さが大きくなるとより内側に曲がることに注意してください。
  private get yesLegBend(): number {
    return this.bowlWidth * 0.15;
  }

  // y の文字の下半分にある曲線を、上端から下端への向きで生成します。
  @part()
  public partYesLeg(): Part {
    let bend = this.yesLegBend;
    let height = this.mean / 2;
    let leftCont = height * 0.6;
    let part = Part.bezier($(0, 0), $(0, leftCont), null, $(bend, height));
    return part;
  }

  // y の文字と同じ形を生成します。
  // 原点は全体の中央にあるので、回転や反転で変化しません。
  @part()
  public partYes(): Part {
    let part = Part.seq(
      this.partYesLeg(),
      this.partCut(),
      this.partYesLeg().reverseZero(),
      this.partInnerBowl(),
      this.partInnerBowl().reflectHorZero().reverseZero(),
      this.partYesLeg().reflectHorZero(),
      this.partCut(),
      this.partYesLeg().reflectHorZero().reverseZero(),
      this.partOuterBowl().reflectHorZero(),
      this.partOuterBowl().reverseZero()
    );
    part.moveZeroTo($(this.bowlWidth / 2, 0));
    return part;
  }

  @glyph("y", "Y")
  public glyphYes(): Glyph {
    let part = Part.union(
      this.partYes().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

}


export type VekosConfig = {weightConst: number, stretchConst: number, contrastRatio: number};