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

  public get metrics(): Metrics {
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
    if (angle >= 0 && angle <= 90) {
      let horWeight = angle / 90;
      let verWeight = 1 - angle / 90;
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

  private get transphoneThicknessRatio(): number {
    return 0.95;
  }

  // 変音符が左側もしくは右側に曲がる水平距離を表します。
  private get transphoneBend(): number {
    return this.bowlWidth * 0.15;
  }

  private get transphoneGap(): number {
    return this.bowlWidth * 0.18;
  }

  // 変音符の右に飛び出るように曲がる曲線の上半分を、下端から上端への向きで生成します。
  @part()
  public partTransphoneSegment(): Part {
    let bend = this.transphoneBend;
    let height = this.mean / 2;
    let rightHandle = height * 0.6;
    let part = Part.bezier($(0, 0), null, $(0, -rightHandle), $(bend, height));
    return part;
  }

  // 変音符の上下にある水平に切られた部分を、左端から右端への向きで生成します。
  @part()
  public partTransphoneCut(): Part {
    let width = this.horThickness * this.transphoneThicknessRatio;
    let part = Part.line($(0, 0), $(width, 0));
    return part;
  }

  // 変音符と同じ形を生成します。
  // 原点は右に飛び出る部分の左中央にあります。
  @part()
  public partTransphone(): Part {
    let part = Part.seq(
      this.partTransphoneSegment(),
      this.partTransphoneSegment().reflectVerZero().reverseZero(),
      this.partTransphoneCut(),
      this.partTransphoneSegment().reflectVerZero(),
      this.partTransphoneSegment().reverseZero(),
      this.partTransphoneCut().reverseZero()
    );
    part.moveZeroTo($(this.transphoneBend, this.mean / 2));
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

  @glyph("r", "R")
  public glyphRes(): Glyph {
    let part = Part.union(
      this.partLes().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("p", "P")
  public glyphPal(): Glyph {
    let part = Part.union(
      this.partLes().rotateHalfTurnZero().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("b", "B")
  public glyphBol(): Glyph {
    let part = Part.union(
      this.partLes().rotateHalfTurnZero().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("c", "C")
  public glyphCal(): Glyph {
    let part = Part.union(
      this.partLes().reflectHorZero().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("q", "Q")
  public glyphQol(): Glyph {
    let part = Part.union(
      this.partLes().reflectHorZero().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("k", "K")
  public glyphKal(): Glyph {
    let part = Part.union(
      this.partLes().reflectVerZero().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("g", "G")
  public glyphGol(): Glyph {
    let part = Part.union(
      this.partLes().reflectVerZero().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
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
    let leftHandle = height * 0.6;
    let part = Part.bezier($(0, 0), $(0, leftHandle), null, $(bend, height));
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

  @glyph("h", "H")
  public glyphHes(): Glyph {
    let part = Part.union(
      this.partYes().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("s", "S")
  public glyphSal(): Glyph {
    let part = Part.union(
      this.partYes().reflectVerZero().translate($(this.bowlWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("z", "Z")
  public glyphZol(): Glyph {
    let part = Part.union(
      this.partYes().reflectVerZero().translate($(this.bowlWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.bowlWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  private get talBeakWidth(): number {
    return this.bowlWidth / 2 * 0.95;
  }

  private get talBeakHeight(): number {
    return this.mean * 0.35;
  }

  private get talWidth(): number {
    return this.bowlWidth / 2 + this.talBeakWidth;
  }

  // t の文字の右上にある部分の外側の曲線を、右端から上端への向きで生成します。
  @part()
  public partOuterTalBeak(): Part {
    let width = this.talBeakWidth;
    let height = this.talBeakHeight + this.overshoot;
    let rightHandle = height * 0.05;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -rightHandle), $(topHandle, 0), $(-width, -height));
    return part;
  }

  // t の文字の右上にある部分の内側の曲線を、右端から上端への向きで生成します。
  @part()
  public partInnerTalBeak(): Part {
    let width = this.talBeakWidth - this.horThickness;
    let height = this.talBeakHeight - this.verThickness + this.overshoot;
    let rightHandle = height * 0.05;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -rightHandle), $(topHandle, 0), $(-width, -height));
    return part;
  }

  // t の文字と同じ形を生成します。
  // 原点は全体の中央にあるので、回転や反転で変化しません。
  @part()
  public partTal(): Part {
    let part = Part.seq(
      this.partOuterBowl().reflectVerZero(),
      this.partOuterTalBeak().reflectVerZero().reverseZero(),
      this.partCut().reverseZero(),
      this.partInnerTalBeak().reflectVerZero(),
      this.partInnerBowl().reflectVerZero().reverseZero(),
      this.partInnerBowl(),
      this.partInnerTalBeak().reverseZero(),
      this.partCut(),
      this.partOuterTalBeak(),
      this.partOuterBowl().reverseZero()
    );
    part.moveZeroTo($(this.talWidth / 2, 0));
    return part;
  }

  @glyph("t", "T")
  public glyphTal(): Glyph {
    let part = Part.union(
      this.partTal().translate($(this.talWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("d", "D")
  public glyphDol(): Glyph {
    let part = Part.union(
      this.partTal().translate($(this.talWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.talWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("f", "F")
  public glyphFal(): Glyph {
    let part = Part.union(
      this.partTal().reflectHorZero().translate($(this.talWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("v", "V")
  public glyphVol(): Glyph {
    let part = Part.union(
      this.partTal().reflectHorZero().translate($(this.talWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.talWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  // x, j の文字に共通する細い丸い部分の見た目の幅を表します。
  // 実際に作られるパーツの幅は、2 つ重ねたときに重なった部分が太く見えないよう補正されるので、この値より小さくなります。
  private get narrowBowlVirtualWidth(): number {
    return this.bowlWidth * 0.9;
  }

  private get narrowBowlCorrection(): number {
    return this.horThickness * 0.15;
  }

  private get narrowBowlWidth(): number {
    return this.narrowBowlVirtualWidth - this.narrowBowlCorrection;
  }

  private get xalWidth(): number {
    return this.narrowBowlVirtualWidth * 2 - this.horThickness;
  }

  // x, j の文字に共通する細い丸い部分の外側の曲線の 4 分の 1 を、左端から上端への向きで生成します。
  @part()
  public partOuterLeftNarrowBowl(): Part {
    let width = this.narrowBowlVirtualWidth / 2;
    let height = this.mean / 2 + this.overshoot;
    let leftHandle = height * 0.1;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -leftHandle), $(-topHandle, 0), $(width, -height));
    return part;
  }

  // x, j の文字に共通する細い丸い部分の外側の曲線の 4 分の 1 を、右端から上端への向きで生成します。
  // ただし、他のトレイルと使い方を揃えるため、左右反転してあります。
  @part()
  public partOuterRightNarrowBowl(): Part {
    let width = this.narrowBowlVirtualWidth / 2 - this.narrowBowlCorrection;
    let height = this.mean / 2 + this.overshoot;
    let leftHandle = height * 0.1;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -leftHandle), $(-topHandle, 0), $(width, -height));
    return part;
  }

  // x, j の文字に共通する細い丸い部分の内側の曲線の 4 分の 1 を、左端から上端への向きで生成します。
  @part()
  public partInnerNarrowBowl(): Part {
    let width = this.narrowBowlVirtualWidth / 2 - this.horThickness;
    let height = this.mean / 2 - this.verThickness + this.overshoot;
    let leftHandle = height * 0.1;
    let topHandle = width;
    let part = Part.bezier($(0, 0), $(0, -leftHandle), $(-topHandle, 0), $(width, -height));
    return part;
  }

  // x, j の文字に共通する細い丸い部分を生成します。
  // 2 つ重ねたときに重なった部分が太く見えすぎないように、右側を少し細く補正してあります。
  // 原点は全体の中央にあります。
  @part()
  public partNarrowBowl(): Part {
    let outerPart = Part.seq(
      this.partOuterLeftNarrowBowl().reflectVerZero(),
      this.partOuterRightNarrowBowl().rotateHalfTurnZero().reverseZero(),
      this.partOuterRightNarrowBowl().reflectHorZero(),
      this.partOuterLeftNarrowBowl().reverseZero()
    );
    let innerPart = Part.seq(
      this.partInnerNarrowBowl().reflectVerZero(),
      this.partInnerNarrowBowl().rotateHalfTurnZero().reverseZero(),
      this.partInnerNarrowBowl().reflectHorZero(),
      this.partInnerNarrowBowl().reverseZero()
    );
    let part = Part.stack(
      outerPart,
      innerPart.reverseZero().translate($(this.horThickness, 0))
    );
    part.moveZeroTo($(this.narrowBowlVirtualWidth / 2, 0));
    return part;
  }

  // x の文字と同じ形を生成します。
  // 原点は全体の中央にあります。
  @part()
  public partXal(): Part {
    let part = Part.union(
      this.partNarrowBowl(),
      this.partNarrowBowl().reflectHorZero().translate($(this.narrowBowlVirtualWidth - this.horThickness, 0))
    );
    part.moveZeroTo($(this.xalWidth / 2 - this.narrowBowlVirtualWidth / 2, 0));
    return part;
  }

  @glyph("x", "X")
  public glyphXal(): Glyph {
    let part = Part.union(
      this.partXal().translate($(this.xalWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("j", "J")
  public glyphJol(): Glyph {
    let part = Part.union(
      this.partXal().translate($(this.xalWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.xalWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  // n の文字の書き終わりと書き始めの箇所について、その先端の外側の端と丸い部分の端との水平距離を表します。
  // 曲線の外側の曲がり具合を指定しているので、線の太さが大きくなるとより内側に曲がることに注意してください。
  private get nesLegBend(): number {
    return this.yesLegBend;
  }

  private get spineWidth(): number {
    return this.bowlWidth * 0.5;
  }

  private get nesWidth(): number {
    return this.narrowBowlVirtualWidth + this.spineWidth;
  }

  private calcSpineError(innerHandle: number, outerHandle: number, bend: number, width: number): number {
    let path = PathUtil.bezier($(0, 0), $(innerHandle, 0), $(-outerHandle, 0), $(width, -bend));
    let basePoint = $(width / 2, -bend / 2 + this.verThickness / 2);
    let nearestPoint = path.getNearestPoint(basePoint);
    let angle = nearestPoint.subtract(basePoint).getAngle($(1, 0)) - 90;
    let error = Math.abs(nearestPoint.getDistance(basePoint) - this.calcIdealThickness(angle) / 2);
    return error;
  }

  private searchSpineInnerHandle(outerHandle: number, bend: number, width: number): number {
    let interval = 0.5;
    let resultHandle = 0;
    let minimumError = 10000;
    for (let innerHandle = 0 ; innerHandle <= width ; innerHandle += interval) {
      let error = this.calcSpineError(innerHandle, outerHandle, bend, width);
      if (error < minimumError) {
        minimumError = error;
        resultHandle = innerHandle;
      }
    }
    return resultHandle;
  }

  // n の文字の書き終わりの箇所にある曲線を、上端から下端への向きで生成します。
  @part()
  public partNesLeg(): Part {
    let bend = this.nesLegBend;
    let height = this.mean / 2;
    let rightHandle = height * 0.6;
    let part = Part.bezier($(0, 0), $(0, rightHandle), null, $(-bend, height));
    return part;
  }

  // n の文字の中央部分の上側の曲線を、下端から上端への向きで生成します。
  @part()
  public partTopSpine(): Part {
    let width = this.spineWidth;
    let bend = this.mean - this.verThickness + this.overshoot * 2;
    let rightHandle = width * 1.05;
    let leftHandle = this.searchSpineInnerHandle(rightHandle, bend, width);
    let part = Part.bezier($(0, 0), $(leftHandle, 0), $(-rightHandle, 0) , $(width, -bend));
    return part;
  }

  // n の文字の中央部分の下側の曲線を、下端から上端への向きで生成します。
  @part()
  public partBottomSpine(): Part {
    let width = this.spineWidth;
    let bend = this.mean - this.verThickness + this.overshoot * 2;
    let leftHandle = width * 1.05;
    let rightHandle = this.searchSpineInnerHandle(leftHandle, bend, width);
    let part = Part.bezier($(0, 0), $(leftHandle, 0), $(-rightHandle, 0) , $(width, -bend));
    return part;
  }

  // n の文字と同じ形を生成します。
  // 原点は全体の中央にあります。
  @part()
  public partNes(): Part {
    let part = Part.seq(
      this.partOuterLeftNarrowBowl().reflectVerZero(),
      this.partBottomSpine(),
      this.partInnerNarrowBowl().reflectHorZero().reverseZero(),
      this.partNesLeg(),
      this.partCut(),
      this.partNesLeg().reverseZero(),
      this.partOuterLeftNarrowBowl().reflectHorZero(),
      this.partTopSpine().reverseZero(),
      this.partInnerNarrowBowl().reflectVerZero().reverseZero(),
      this.partNesLeg().rotateHalfTurnZero(),
      this.partCut().reverseZero(),
      this.partNesLeg().rotateHalfTurnZero().reverseZero()
    );
    part.moveZeroTo($(this.nesWidth / 2, 0));
    return part;
  }

  @glyph("n", "N")
  public glyphNes(): Glyph {
    let part = Part.union(
      this.partNes().translate($(this.nesWidth / 2, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

  @glyph("m", "M")
  public glyphMes(): Glyph {
    let part = Part.union(
      this.partNes().translate($(this.nesWidth / 2, -this.mean / 2)),
      this.partTransphone().translate($(this.nesWidth + this.transphoneGap, -this.mean / 2))
    );
    let glyph = Glyph.byBearings(part, this.metrics, this.bearings);
    return glyph;
  }

}


export type VekosConfig = {weightConst: number, stretchConst: number, contrastRatio: number};