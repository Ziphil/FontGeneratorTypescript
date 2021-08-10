//

import {
  $,
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
export class GilitGenerator extends Generator<GilitConfig> {

  private get ascent(): number {
    return this.triangleHeight + this.ascenderHeight + this.maxThickness / (MathUtil.cosDeg(this.maxObliqueAngle) * 4);
  }

  private get descent(): number {
    return this.ascenderHeight + this.maxThickness / (MathUtil.cosDeg(this.maxObliqueAngle) * 4);
  }

  private get extraDescent(): number {
    return 0;
  }

  private get extraAscent(): number {
    return 0;
  }

  public get metrics(): Metrics {
    let ascent = this.ascent + this.extraAscent;
    let descent = this.descent + this.extraDescent;
    let em = descent + ascent;
    let metrics = {em, ascent, descent};
    return metrics;
  }

  private get triangleHeight(): number {
    return 500;
  }

  private get triangleWidth(): number {
    return this.triangleHeight * this.config.stretchRatio;
  }

  private get thickness(): number {
    return this.config.weightConst * 80;
  }

  // 同じファミリーにおけるストローク幅の最大値を表します。
  // このフォントは、グリフの設計上、ストロークの幅や三角形部分の幅によってアセンダーやディセンダーの高さが異なります。
  // したがって、フォントサイズを同じにすると、グリフ全体が拡大縮小され、ウェイトによって三角形部分の大きさが変わる可能性があります。
  // これを防ぐため、フォントファイルに登録されるアセントやディセントはこの値を用いて計算され、ウェイトを通して固定されます。
  private get maxThickness(): number {
    return 140;
  }

  private get obliqueAngle(): number {
    return MathUtil.atan2Deg(this.triangleHeight, this.triangleWidth / 2);
  }

  // 同じファミリーにおける三角形の斜辺の角度の最大値を表します。
  // 上記と同じ理由のため、フォントファイルに登録されるアセントやディセントはこの値を用いて計算されます。
  private get maxObliqueAngle(): number {
    return MathUtil.atanDeg(2);
  }

  @part()
  public partCut(): Part {
    let y = -this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partHorizontalCut(): Part {
    let x = this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partRightLeftOblique(): Part {
    let y = -this.triangleHeight - this.thickness / 2;
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftLeftOblique(): Part {
    let y = this.triangleHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) + this.thickness / 2;
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftOblique(): Part {
    let part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftOblique()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightOblique(): Part {
    let part = this.partLeftOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  private get diamondGap(): number {
    return this.thickness * 1;
  }

  @part()
  public partRightLeftShortOblique(): Part {
    let y = -this.triangleHeight + this.diamondGap * MathUtil.sinDeg(this.obliqueAngle) - this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftLeftShortOblique(): Part {
    let y = this.triangleHeight - this.diamondGap * MathUtil.sinDeg(this.obliqueAngle) + this.thickness / 2;
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftShortOblique(): Part {
    let part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftShortOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftShortOblique()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightShortOblique(): Part {
    let part = this.partLeftShortOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partHorizontalChippedCut(): Part {
    let x = this.thickness / MathUtil.sinDeg(this.obliqueAngle) - this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftLeftChippedOblique(): Part {
    let y = this.triangleHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partChip(): Part {
    let y = this.thickness / 2;
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftChippedOblique(): Part {
    let part = Part.seq(
      this.partChip(),
      this.partHorizontalChippedCut(),
      this.partRightLeftOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftChippedOblique()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedOblique(): Part {
    let part = this.partLeftChippedOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftCutOblique(): Part {
    let y = this.triangleHeight + this.thickness;
    let x = -y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftCutOblique(): Part {
    let part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftOblique(),
      this.partChip().rotateHalfTurn(),
      this.partHorizontalChippedCut().reverse(),
      this.partLeftLeftCutOblique()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightCutOblique(): Part {
    let part = this.partLeftCutOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftCenterOblique(): Part {
    let part = Part.seq(
      this.partChip(),
      this.partHorizontalChippedCut(),
      this.partRightLeftOblique(),
      this.partChip().rotateHalfTurn(),
      this.partHorizontalChippedCut().reverse(),
      this.partRightLeftOblique().reverse()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightCenterOblique(): Part {
    let part = this.partLeftCenterOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partBottomBase(): Part {
    let x = this.triangleWidth + this.thickness / MathUtil.sinDeg(this.obliqueAngle) + this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partRightBase(): Part {
    let y = -this.thickness;
    let x = -this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partTopBase(): Part {
    let x = -this.triangleWidth - this.thickness / MathUtil.sinDeg(this.obliqueAngle) + this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftBase(): Part {
    let y = this.thickness;
    let x = -this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partBase(): Part {
    let part = Part.seq(
      this.partBottomBase(),
      this.partRightBase(),
      this.partTopBase(),
      this.partLeftBase()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partBottomLeftChippedBase(): Part {
    let x = this.triangleWidth + this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftChippedBase(): Part {
    let part = Part.seq(
      this.partChip(),
      this.partBottomLeftChippedBase(),
      this.partRightBase(),
      this.partTopBase(),
      this.partChip().reflectVer().reverse()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedBase(): Part {
    let part = this.partLeftChippedBase().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partChippedBase(): Part {
    let part = Part.seq(
      this.partChip(),
      this.partTopBase().reverse(),
      this.partChip().reflectHor().reverse(),
      this.partChip().rotateHalfTurn(),
      this.partTopBase(),
      this.partChip().reflectVer().reverse()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  // ディセンダー部分の高さを表します。
  // フォントのデザインの統一感のため、この値はアセンダー部分の高さとしても利用されます。
  private get ascenderHeight(): number {
    return this.triangleHeight * this.config.ascenderRatio;
  }

  @part()
  public partRightLeftAscender(): Part {
    let y = -this.ascenderHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftAscender(): Part {
    let part = Part.seq(
      this.partCut(),
      this.partRightLeftAscender(),
      this.partCut().reverse(),
      this.partRightLeftAscender().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = this.triangleHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightAscender(): Part {
    let part = this.partLeftAscender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftDescender(): Part {
    let y = this.ascenderHeight + this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partRightLeftDescender(): Part {
    let y = -this.ascenderHeight - this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftDescender(): Part {
    let part = Part.seq(
      this.partLeftLeftDescender(),
      this.partCut(),
      this.partRightLeftDescender(),
      this.partHorizontalCut().reverse()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightDescender(): Part {
    let part = this.partLeftDescender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftChippedDescender(): Part {
    let y = this.ascenderHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftChippedDescender(): Part {
    let part = Part.seq(
      this.partLeftLeftChippedDescender(),
      this.partCut(),
      this.partRightLeftDescender(),
      this.partHorizontalChippedCut().reverse(),
      this.partChip()
    );
    let x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedDescender(): Part {
    let part = this.partLeftChippedDescender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partDiamond(): Part {
    let part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = this.triangleHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  private get transphoneGap(): number {
    return this.gap;
  }

  private get horizontalTransphoneGap(): number {
    return this.transphoneGap / MathUtil.sinDeg(this.obliqueAngle);
  }

  @part()
  public partRightTransphone(): Part {
    let y = -this.triangleHeight - this.thickness;
    let x = y / MathUtil.tanDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partTransphone(): Part {
    let part = Part.seq(
      this.partHorizontalCut(),
      this.partRightTransphone(),
      this.partHorizontalCut().reverse(),
      this.partRightTransphone().reverse()
    );
    let x = -this.triangleWidth - this.horizontalTransphoneGap - this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) - this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    let y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  private get overshoot(): number {
    return this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) - this.thickness / 2;
  }

  // 三角形部分とアクセント記号の鉛直方向の間隔を表します。
  // 三角形の尖っている方にアキュートアクセントが付く場合、この値は尖っている部分の先端とアクセント記号の底辺部分との間隔です。
  // 三角形の底辺の方にアキュートアクセントが付く場合、この値は両方の底辺の間の間隔です。
  // アキュートアクセント以外のアクセント記号については、実際の間隔はアクセント記号側のオーバーシュートの分だけ小さくなります。
  private get diacriticGap(): number {
    return this.triangleHeight * 0.15;
  }

  // アクセント記号のオーバーシュートについて、三角形部分のオーバーシュートに対する比率を表します。
  private get diacriticOvershootRatio(): number {
    return 0.3;
  }

  private get acuteRatio(): number {
    return 1.3;
  }

  @part()
  public partUpperAcuteCut(): Part {
    let y = -this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    let x = this.thickness * this.acuteRatio / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    let part = Part.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partUpperAcuteHorizontalCut(): Part {
    let x = this.thickness * this.acuteRatio / MathUtil.sinDeg(this.obliqueAngle);
    let part = Part.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partUpperAcute(): Part {
    let part = Part.seq(
      this.partUpperAcuteCut().reverse(),
      this.partUpperAcuteHorizontalCut(),
      this.partUpperAcuteCut().reflectHor()
    );
    let x = -this.triangleWidth / 2;
    let y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) + this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partUpperGrave(): Part {
    let part = Part.seq(
      this.partUpperAcuteCut(),
      this.partUpperAcuteHorizontalCut().reverse(),
      this.partUpperAcuteCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) - this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partUpperCircumflex(): Part {
    let part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) - this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerAcute(): Part {
    let part = Part.seq(
      this.partUpperAcuteCut(),
      this.partUpperAcuteHorizontalCut().reverse(),
      this.partUpperAcuteCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = -this.diacriticGap - this.thickness / 2 - this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerGrave(): Part {
    let part = Part.seq(
      this.partUpperAcuteCut().reverse(),
      this.partUpperAcuteHorizontalCut(),
      this.partUpperAcuteCut().reflectHor()
    );
    let x = -this.triangleWidth / 2;
    let y = -this.diacriticGap - this.thickness / 2 + this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerCircumflex(): Part {
    let part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 2;
    let y = -this.diacriticGap - this.thickness / 2 - this.thickness / MathUtil.cosDeg(this.obliqueAngle) + this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partDot(): Part {
    let part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    let x = -this.triangleWidth / 4;
    let y = this.triangleHeight / 2 - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  // 文字と文字の間隔を表します。
  // ただし、隣り合う三角形の斜辺部に垂直な方向の距離であり、水平距離ではありません。
  private get gap(): number {
    return this.thickness * 1.1;
  }

  private transposePart(part: Part): Part {
    let transposedPart = part.reflectVer().moveOrigin($(0, this.triangleHeight));
    return transposedPart;
  }

  private createFixedSpacing(size: 0 | 1 | 2, transphone: boolean): {leftEnd: number, width: number} {
    let leftEnd = this.triangleWidth / 4 - this.gap / (MathUtil.sinDeg(this.obliqueAngle) * 2) - this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    let width = -this.triangleWidth / 2 + this.gap / MathUtil.sinDeg(this.obliqueAngle) + this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    if (size === 0) {
      width += this.triangleWidth / 2;
    } else if (size === 1) {
      width += this.triangleWidth;
    } else {
      width += this.triangleWidth * 3 / 2;
    }
    if (transphone) {
      width += this.horizontalTransphoneGap + this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    }
    return {leftEnd, width};
  }

  @glyph("s")
  public glyphUpSal(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partLeftShortOblique(),
      this.partRightShortOblique(),
      this.partDiamond()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("S")
  public glyphDownSal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("z")
  public glyphUpZol(): Glyph {
    let part = Part.union(
      this.glyphUpSal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Z")
  public glyphDownZol(): Glyph {
    let part = Part.union(
      this.glyphDownSal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("t")
  public glyphUpTal(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partLeftOblique()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("T")
  public glyphDownTal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("d")
  public glyphUpDol(): Glyph {
    let part = Part.union(
      this.glyphUpTal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("D")
  public glyphDownDol(): Glyph {
    let part = Part.union(
      this.glyphDownTal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("k")
  public glyphUpKal(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique(),
      this.partLeftAscender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("K")
  public glyphDownKal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.transposePart(this.partRightChippedDescender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("g")
  public glyphUpGol(): Glyph {
    let part = Part.union(
      this.glyphUpKal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("G")
  public glyphDownGol(): Glyph {
    let part = Part.union(
      this.glyphDownKal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("f")
  public glyphUpFal(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partRightOblique()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("F")
  public glyphDownFal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partRightOblique())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("v")
  public glyphUpVol(): Glyph {
    let part = Part.union(
      this.glyphUpFal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("V")
  public glyphDownVol(): Glyph {
    let part = Part.union(
      this.glyphDownFal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("p")
  public glyphUpPal(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique(),
      this.partRightAscender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("P")
  public glyphDownPal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftChippedOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftChippedDescender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("b")
  public glyphUpBol(): Glyph {
    let part = Part.union(
      this.glyphUpPal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("B")
  public glyphDownBol(): Glyph {
    let part = Part.union(
      this.glyphDownPal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("c")
  public glyphUpCal(): Glyph {
    let part = Part.union(
      this.partChippedBase(),
      this.partLeftChippedOblique(),
      this.partRightOblique(),
      this.partLeftChippedDescender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("C")
  public glyphDownCal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partRightAscender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("q")
  public glyphUpQol(): Glyph {
    let part = Part.union(
      this.glyphUpCal().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Q")
  public glyphDownQol(): Glyph {
    let part = Part.union(
      this.glyphDownCal().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("x")
  public glyphUpXal(): Glyph {
    let part = Part.union(
      this.partChippedBase(),
      this.partLeftCutOblique(),
      this.partRightCenterOblique(),
      this.transposePart(this.partChippedBase()).translate($(this.triangleWidth / 2, 0)),
      this.transposePart(this.partRightCutOblique()).translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("X")
  public glyphDownXal(): Glyph {
    let part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftCutOblique()),
      this.transposePart(this.partRightCenterOblique()),
      this.partChippedBase().translate($(this.triangleWidth / 2, 0)),
      this.partRightCutOblique().translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("j")
  public glyphUpJol(): Glyph {
    let part = Part.union(
      this.glyphUpXal().toPart(),
      this.transposePart(this.partTransphone()).translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("J")
  public glyphDownJol(): Glyph {
    let part = Part.union(
      this.glyphDownXal().toPart(),
      this.partTransphone().translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("l")
  public glyphUpLes(): Glyph {
    let part = Part.union(
      this.partChippedBase(),
      this.partLeftOblique(),
      this.partRightChippedOblique(),
      this.partRightChippedDescender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("L")
  public glyphDownLes(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftAscender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("r")
  public glyphUpRes(): Glyph {
    let part = Part.union(
      this.glyphUpLes().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("R")
  public glyphDownRes(): Glyph {
    let part = Part.union(
      this.glyphDownLes().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("n")
  public glyphUpNes(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partRightCenterOblique(),
      this.transposePart(this.partBase()).translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("N")
  public glyphDownNes(): Glyph {
    let part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.partRightOblique().translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("m")
  public glyphUpMes(): Glyph {
    let part = Part.union(
      this.glyphUpNes().toPart(),
      this.transposePart(this.partTransphone()).translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("M")
  public glyphDownMes(): Glyph {
    let part = Part.union(
      this.glyphDownNes().toPart(),
      this.partTransphone().translate($(this.triangleWidth / 2, 0))
    );
    let spacing = this.createFixedSpacing(2, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("y")
  public glyphUpYes(): Glyph {
    let part = Part.union(
      this.partLeftOblique(),
      this.partRightOblique()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Y")
  public glyphDownYes(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftShortOblique()),
      this.transposePart(this.partRightShortOblique()),
      this.transposePart(this.partDiamond())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("h")
  public glyphUpHes(): Glyph {
    let part = Part.union(
      this.glyphUpYes().toPart(),
      this.partTransphone()
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("H")
  public glyphDownHes(): Glyph {
    let part = Part.union(
      this.glyphDownYes().toPart(),
      this.transposePart(this.partTransphone())
    );
    let spacing = this.createFixedSpacing(1, true);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("w")
  public glyphUpTransphone(): Glyph {
    let part = Part.union(
      this.transposePart(this.partTransphone()).translate($(-this.triangleWidth / 2 - this.horizontalTransphoneGap - this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    let spacing = this.createFixedSpacing(0, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("W")
  public glyphDownTransphone(): Glyph {
    let part = Part.union(
      this.partTransphone().translate($(-this.triangleWidth / 2 - this.horizontalTransphoneGap - this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    let spacing = this.createFixedSpacing(0, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("a")
  public glyphUpAt(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("A")
  public glyphDownAt(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("á")
  public glyphUpAtAcute(): Glyph {
    let part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperAcute()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Á")
  public glyphDownAtAcute(): Glyph {
    let part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerAcute())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("à")
  public glyphUpAtGrave(): Glyph {
    let part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperGrave()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("À")
  public glyphDownAtGrave(): Glyph {
    let part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("â")
  public glyphUpAtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperCircumflex()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Â")
  public glyphDownAtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("e")
  public glyphUpEt(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partRightOblique(),
      this.partLeftAscender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("E")
  public glyphDownEt(): Glyph {
    let part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.transposePart(this.partRightChippedDescender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("é")
  public glyphUpEtAcute(): Glyph {
    let part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerAcute()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("É")
  public glyphDownEtAcute(): Glyph {
    let part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperAcute())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("è")
  public glyphUpEtGrave(): Glyph {
    let part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerGrave()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("È")
  public glyphDownEtGrave(): Glyph {
    let part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperGrave())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ê")
  public glyphUpEtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerCircumflex()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ê")
  public glyphDownEtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperCircumflex())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("i")
  public glyphUpIt(): Glyph {
    let part = Part.union(
      this.partLeftChippedOblique(),
      this.partRightOblique(),
      this.partLeftChippedDescender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("I")
  public glyphDownIt(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightAscender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("í")
  public glyphUpItAcute(): Glyph {
    let part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperAcute()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Í")
  public glyphDownItAcute(): Glyph {
    let part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerAcute())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ì")
  public glyphUpItGrave(): Glyph {
    let part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperGrave()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ì")
  public glyphDownItGrave(): Glyph {
    let part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("î")
  public glyphUpItCircumflex(): Glyph {
    let part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperCircumflex()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Î")
  public glyphDownItCircumflex(): Glyph {
    let part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("o")
  public glyphUpOt(): Glyph {
    let part = Part.union(
      this.partBase(),
      this.partRightOblique(),
      this.partRightAscender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("O")
  public glyphDownOt(): Glyph {
    let part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftDescender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ò")
  public glyphUpOtGrave(): Glyph {
    let part = Part.union(
      this.glyphUpOt().toPart(),
      this.partLowerGrave()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ò")
  public glyphDownOtGrave(): Glyph {
    let part = Part.union(
      this.glyphDownOt().toPart(),
      this.transposePart(this.partUpperGrave())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ô")
  public glyphUpOtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphUpOt().toPart(),
      this.partLowerCircumflex()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ô")
  public glyphDownOtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphDownOt().toPart(),
      this.transposePart(this.partUpperCircumflex())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("u")
  public glyphUpUt(): Glyph {
    let part = Part.union(
      this.partChippedBase(),
      this.partLeftOblique(),
      this.partRightDescender()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("U")
  public glyphDownUt(): Glyph {
    let part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partLeftAscender())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ù")
  public glyphUpUtGrave(): Glyph {
    let part = Part.union(
      this.glyphUpUt().toPart(),
      this.partUpperGrave()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ù")
  public glyphDownUtGrave(): Glyph {
    let part = Part.union(
      this.glyphDownUt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("û")
  public glyphUpUtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphUpUt().toPart(),
      this.partUpperCircumflex()
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Û")
  public glyphDownUtCircumflex(): Glyph {
    let part = Part.union(
      this.glyphDownUt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    let spacing = this.createFixedSpacing(1, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph(",")
  public glyphTadek(): Glyph {
    let part = Part.union(
      this.partDot()
    );
    let spacing = this.createFixedSpacing(0, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph(".", "!", "?")
  public glyphDek(): Glyph {
    let part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    let spacing = this.createFixedSpacing(0, false);
    spacing.width += this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("'", "ʻ")
  public glyphNok(): Glyph {
    let part = Part.union(
      this.partDot()
    );
    let spacing = this.createFixedSpacing(0, false);
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  private get spaceWidth(): number {
    return this.triangleWidth * 0.5;
  }

  @glyph(" ")
  public glyphSpace(): Glyph {
    let part = Part.empty();
    let spacing = {leftEnd: 0, width: this.spaceWidth};
    let glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

}


export type GilitConfig = {
  weightConst: number,
  stretchRatio: number,
  ascenderRatio: number
};