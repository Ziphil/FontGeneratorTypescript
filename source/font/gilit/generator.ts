//

import {
  $,
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
export class GilitGenerator extends Generator<GilitConfig> {

  public get metrics(): Metrics {
    const ascent = this.ascent + this.extraAscent;
    const descent = this.descent + this.extraDescent;
    const em = descent + ascent;
    const metrics = {em, ascent, descent};
    return metrics;
  }

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
  public partCut(): Contour {
    const y = -this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partHorizontalCut(): Contour {
    const x = this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partRightLeftOblique(): Contour {
    const y = -this.triangleHeight - this.thickness / 2;
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftLeftOblique(): Contour {
    const y = this.triangleHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) + this.thickness / 2;
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftOblique(): Part {
    const part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftOblique()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightOblique(): Part {
    const part = this.partLeftOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  private get diamondGap(): number {
    return this.thickness * 1;
  }

  @part()
  public partRightLeftShortOblique(): Contour {
    const y = -this.triangleHeight + this.diamondGap * MathUtil.sinDeg(this.obliqueAngle) - this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftLeftShortOblique(): Contour {
    const y = this.triangleHeight - this.diamondGap * MathUtil.sinDeg(this.obliqueAngle) + this.thickness / 2;
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftShortOblique(): Part {
    const part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftShortOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftShortOblique()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightShortOblique(): Part {
    const part = this.partLeftShortOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partHorizontalChippedCut(): Contour {
    const x = this.thickness / MathUtil.sinDeg(this.obliqueAngle) - this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftLeftChippedOblique(): Contour {
    const y = this.triangleHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partChip(): Contour {
    const y = this.thickness / 2;
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftChippedOblique(): Part {
    const part = Part.seq(
      this.partChip(),
      this.partHorizontalChippedCut(),
      this.partRightLeftOblique(),
      this.partCut().reflectVer().reverse(),
      this.partLeftLeftChippedOblique()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedOblique(): Part {
    const part = this.partLeftChippedOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftCutOblique(): Contour {
    const y = this.triangleHeight + this.thickness;
    const x = -y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftCutOblique(): Part {
    const part = Part.seq(
      this.partHorizontalCut(),
      this.partRightLeftOblique(),
      this.partChip().rotateHalfTurn(),
      this.partHorizontalChippedCut().reverse(),
      this.partLeftLeftCutOblique()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightCutOblique(): Part {
    const part = this.partLeftCutOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftCenterOblique(): Part {
    const part = Part.seq(
      this.partChip(),
      this.partHorizontalChippedCut(),
      this.partRightLeftOblique(),
      this.partChip().rotateHalfTurn(),
      this.partHorizontalChippedCut().reverse(),
      this.partRightLeftOblique().reverse()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightCenterOblique(): Part {
    const part = this.partLeftCenterOblique().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partBottomBase(): Contour {
    const x = this.triangleWidth + this.thickness / MathUtil.sinDeg(this.obliqueAngle) + this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partRightBase(): Contour {
    const y = -this.thickness;
    const x = -this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partTopBase(): Contour {
    const x = -this.triangleWidth - this.thickness / MathUtil.sinDeg(this.obliqueAngle) + this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftBase(): Contour {
    const y = this.thickness;
    const x = -this.thickness / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partBase(): Part {
    const part = Part.seq(
      this.partBottomBase(),
      this.partRightBase(),
      this.partTopBase(),
      this.partLeftBase()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = -this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partBottomLeftChippedBase(): Contour {
    const x = this.triangleWidth + this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partLeftChippedBase(): Part {
    const part = Part.seq(
      this.partChip(),
      this.partBottomLeftChippedBase(),
      this.partRightBase(),
      this.partTopBase(),
      this.partChip().reflectVer().reverse()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedBase(): Part {
    const part = this.partLeftChippedBase().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partChippedBase(): Part {
    const part = Part.seq(
      this.partChip(),
      this.partTopBase().reverse(),
      this.partChip().reflectHor().reverse(),
      this.partChip().rotateHalfTurn(),
      this.partTopBase(),
      this.partChip().reflectVer().reverse()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  // ディセンダー部分の高さを表します。
  // フォントのデザインの統一感のため、この値はアセンダー部分の高さとしても利用されます。
  private get ascenderHeight(): number {
    return this.triangleHeight * this.config.ascenderRatio;
  }

  @part()
  public partRightLeftAscender(): Contour {
    const y = -this.ascenderHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftAscender(): Part {
    const part = Part.seq(
      this.partCut(),
      this.partRightLeftAscender(),
      this.partCut().reverse(),
      this.partRightLeftAscender().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = this.triangleHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightAscender(): Part {
    const part = this.partLeftAscender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftDescender(): Contour {
    const y = this.ascenderHeight + this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partRightLeftDescender(): Contour {
    const y = -this.ascenderHeight - this.thickness / 2 + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftDescender(): Part {
    const part = Part.seq(
      this.partLeftLeftDescender(),
      this.partCut(),
      this.partRightLeftDescender(),
      this.partHorizontalCut().reverse()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) + this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = this.thickness / 2;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partRightDescender(): Part {
    const part = this.partLeftDescender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partLeftLeftChippedDescender(): Contour {
    const y = this.ascenderHeight + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 4);
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partLeftChippedDescender(): Part {
    const part = Part.seq(
      this.partLeftLeftChippedDescender(),
      this.partCut(),
      this.partRightLeftDescender(),
      this.partHorizontalChippedCut().reverse(),
      this.partChip()
    );
    const x = this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, 0));
    return part;
  }

  @part()
  public partRightChippedDescender(): Part {
    const part = this.partLeftChippedDescender().reflectHor().moveOrigin($(-this.triangleWidth, 0));
    return part;
  }

  @part()
  public partDiamond(): Part {
    const part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = this.triangleHeight - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
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
  public partRightTransphone(): Contour {
    const y = -this.triangleHeight - this.thickness;
    const x = y / MathUtil.tanDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partTransphone(): Part {
    const part = Part.seq(
      this.partHorizontalCut(),
      this.partRightTransphone(),
      this.partHorizontalCut().reverse(),
      this.partRightTransphone().reverse()
    );
    const x = -this.triangleWidth - this.horizontalTransphoneGap - this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2) - this.thickness / (MathUtil.tanDeg(this.obliqueAngle) * 2);
    const y = -this.thickness / 2;
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
  public partUpperAcuteCut(): Contour {
    const y = -this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    const x = this.thickness * this.acuteRatio / (MathUtil.sinDeg(this.obliqueAngle) * 2);
    const part = Contour.line($(0, 0), $(x, y));
    return part;
  }

  @part()
  public partUpperAcuteHorizontalCut(): Contour {
    const x = this.thickness * this.acuteRatio / MathUtil.sinDeg(this.obliqueAngle);
    const part = Contour.line($(0, 0), $(x, 0));
    return part;
  }

  @part()
  public partUpperAcute(): Part {
    const part = Part.seq(
      this.partUpperAcuteCut().reverse(),
      this.partUpperAcuteHorizontalCut(),
      this.partUpperAcuteCut().reflectHor()
    );
    const x = -this.triangleWidth / 2;
    const y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) + this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partUpperGrave(): Part {
    const part = Part.seq(
      this.partUpperAcuteCut(),
      this.partUpperAcuteHorizontalCut().reverse(),
      this.partUpperAcuteCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) - this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partUpperCircumflex(): Part {
    const part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = this.triangleHeight + this.diacriticGap + this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2) - this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerAcute(): Part {
    const part = Part.seq(
      this.partUpperAcuteCut(),
      this.partUpperAcuteHorizontalCut().reverse(),
      this.partUpperAcuteCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = -this.diacriticGap - this.thickness / 2 - this.thickness * this.acuteRatio / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerGrave(): Part {
    const part = Part.seq(
      this.partUpperAcuteCut().reverse(),
      this.partUpperAcuteHorizontalCut(),
      this.partUpperAcuteCut().reflectHor()
    );
    const x = -this.triangleWidth / 2;
    const y = -this.diacriticGap - this.thickness / 2 + this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partLowerCircumflex(): Part {
    const part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 2;
    const y = -this.diacriticGap - this.thickness / 2 - this.thickness / MathUtil.cosDeg(this.obliqueAngle) + this.overshoot * this.diacriticOvershootRatio;
    part.moveOrigin($(x, y));
    return part;
  }

  @part()
  public partDot(): Part {
    const part = Part.seq(
      this.partCut(),
      this.partCut().reflectVer().reverse(),
      this.partCut().rotateHalfTurn(),
      this.partCut().reflectHor().reverse()
    );
    const x = -this.triangleWidth / 4;
    const y = this.triangleHeight / 2 - this.thickness / (MathUtil.cosDeg(this.obliqueAngle) * 2);
    part.moveOrigin($(x, y));
    return part;
  }

  // 文字と文字の間隔を表します。
  // ただし、隣り合う三角形の斜辺部に垂直な方向の距離であり、水平距離ではありません。
  private get gap(): number {
    return this.thickness * 1.1;
  }

  private transposePart(part: Part): Part {
    const transposedPart = part.reflectVer().moveOrigin($(0, this.triangleHeight));
    return transposedPart;
  }

  private createFixedSpacing(size: 0 | 1 | 2, transphone: boolean): {leftEnd: number, width: number} {
    const leftEnd = this.triangleWidth / 4 - this.gap / (MathUtil.sinDeg(this.obliqueAngle) * 2) - this.thickness / (MathUtil.sinDeg(this.obliqueAngle) * 2);
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
    const part = Part.union(
      this.partBase(),
      this.partLeftShortOblique(),
      this.partRightShortOblique(),
      this.partDiamond()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("S")
  public glyphDownSal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("z")
  public glyphUpZol(): Glyph {
    const part = Part.union(
      this.glyphUpSal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Z")
  public glyphDownZol(): Glyph {
    const part = Part.union(
      this.glyphDownSal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("t")
  public glyphUpTal(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partLeftOblique()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("T")
  public glyphDownTal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("d")
  public glyphUpDol(): Glyph {
    const part = Part.union(
      this.glyphUpTal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("D")
  public glyphDownDol(): Glyph {
    const part = Part.union(
      this.glyphDownTal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("k")
  public glyphUpKal(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique(),
      this.partLeftAscender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("K")
  public glyphDownKal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.transposePart(this.partRightChippedDescender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("g")
  public glyphUpGol(): Glyph {
    const part = Part.union(
      this.glyphUpKal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("G")
  public glyphDownGol(): Glyph {
    const part = Part.union(
      this.glyphDownKal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("f")
  public glyphUpFal(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partRightOblique()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("F")
  public glyphDownFal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partRightOblique())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("v")
  public glyphUpVol(): Glyph {
    const part = Part.union(
      this.glyphUpFal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("V")
  public glyphDownVol(): Glyph {
    const part = Part.union(
      this.glyphDownFal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("p")
  public glyphUpPal(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique(),
      this.partRightAscender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("P")
  public glyphDownPal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftChippedOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftChippedDescender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("b")
  public glyphUpBol(): Glyph {
    const part = Part.union(
      this.glyphUpPal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("B")
  public glyphDownBol(): Glyph {
    const part = Part.union(
      this.glyphDownPal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("c")
  public glyphUpCal(): Glyph {
    const part = Part.union(
      this.partChippedBase(),
      this.partLeftChippedOblique(),
      this.partRightOblique(),
      this.partLeftChippedDescender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("C")
  public glyphDownCal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partRightAscender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("q")
  public glyphUpQol(): Glyph {
    const part = Part.union(
      this.glyphUpCal().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Q")
  public glyphDownQol(): Glyph {
    const part = Part.union(
      this.glyphDownCal().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("x")
  public glyphUpXal(): Glyph {
    const part = Part.union(
      this.partChippedBase(),
      this.partLeftCutOblique(),
      this.partRightCenterOblique(),
      this.transposePart(this.partChippedBase()).translate($(this.triangleWidth / 2, 0)),
      this.transposePart(this.partRightCutOblique()).translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("X")
  public glyphDownXal(): Glyph {
    const part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partLeftCutOblique()),
      this.transposePart(this.partRightCenterOblique()),
      this.partChippedBase().translate($(this.triangleWidth / 2, 0)),
      this.partRightCutOblique().translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("j")
  public glyphUpJol(): Glyph {
    const part = Part.union(
      this.glyphUpXal().toPart(),
      this.transposePart(this.partTransphone()).translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("J")
  public glyphDownJol(): Glyph {
    const part = Part.union(
      this.glyphDownXal().toPart(),
      this.partTransphone().translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("l")
  public glyphUpLes(): Glyph {
    const part = Part.union(
      this.partChippedBase(),
      this.partLeftOblique(),
      this.partRightChippedOblique(),
      this.partRightChippedDescender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("L")
  public glyphDownLes(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftAscender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("r")
  public glyphUpRes(): Glyph {
    const part = Part.union(
      this.glyphUpLes().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("R")
  public glyphDownRes(): Glyph {
    const part = Part.union(
      this.glyphDownLes().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("n")
  public glyphUpNes(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partRightCenterOblique(),
      this.transposePart(this.partBase()).translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("N")
  public glyphDownNes(): Glyph {
    const part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.partRightOblique().translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("m")
  public glyphUpMes(): Glyph {
    const part = Part.union(
      this.glyphUpNes().toPart(),
      this.transposePart(this.partTransphone()).translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("M")
  public glyphDownMes(): Glyph {
    const part = Part.union(
      this.glyphDownNes().toPart(),
      this.partTransphone().translate($(this.triangleWidth / 2, 0))
    );
    const spacing = this.createFixedSpacing(2, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("y")
  public glyphUpYes(): Glyph {
    const part = Part.union(
      this.partLeftOblique(),
      this.partRightOblique()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Y")
  public glyphDownYes(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftShortOblique()),
      this.transposePart(this.partRightShortOblique()),
      this.transposePart(this.partDiamond())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("h")
  public glyphUpHes(): Glyph {
    const part = Part.union(
      this.glyphUpYes().toPart(),
      this.partTransphone()
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("H")
  public glyphDownHes(): Glyph {
    const part = Part.union(
      this.glyphDownYes().toPart(),
      this.transposePart(this.partTransphone())
    );
    const spacing = this.createFixedSpacing(1, true);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("w")
  public glyphUpTransphone(): Glyph {
    const part = Part.union(
      this.transposePart(this.partTransphone()).translate($(-this.triangleWidth / 2 - this.horizontalTransphoneGap - this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    const spacing = this.createFixedSpacing(0, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("W")
  public glyphDownTransphone(): Glyph {
    const part = Part.union(
      this.partTransphone().translate($(-this.triangleWidth / 2 - this.horizontalTransphoneGap - this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    const spacing = this.createFixedSpacing(0, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("a")
  public glyphUpAt(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partLeftOblique(),
      this.partRightOblique()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("A")
  public glyphDownAt(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightOblique())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("á")
  public glyphUpAtAcute(): Glyph {
    const part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperAcute()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Á")
  public glyphDownAtAcute(): Glyph {
    const part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerAcute())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("à")
  public glyphUpAtGrave(): Glyph {
    const part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperGrave()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("À")
  public glyphDownAtGrave(): Glyph {
    const part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("â")
  public glyphUpAtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUpAt().toPart(),
      this.partUpperCircumflex()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Â")
  public glyphDownAtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphDownAt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("e")
  public glyphUpEt(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partRightOblique(),
      this.partLeftAscender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("E")
  public glyphDownEt(): Glyph {
    const part = Part.union(
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightChippedOblique()),
      this.transposePart(this.partRightChippedDescender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("é")
  public glyphUpEtAcute(): Glyph {
    const part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerAcute()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("É")
  public glyphDownEtAcute(): Glyph {
    const part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperAcute())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("è")
  public glyphUpEtGrave(): Glyph {
    const part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerGrave()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("È")
  public glyphDownEtGrave(): Glyph {
    const part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperGrave())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ê")
  public glyphUpEtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUpEt().toPart(),
      this.partLowerCircumflex()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ê")
  public glyphDownEtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphDownEt().toPart(),
      this.transposePart(this.partUpperCircumflex())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("i")
  public glyphUpIt(): Glyph {
    const part = Part.union(
      this.partLeftChippedOblique(),
      this.partRightOblique(),
      this.partLeftChippedDescender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("I")
  public glyphDownIt(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partRightAscender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("í")
  public glyphUpItAcute(): Glyph {
    const part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperAcute()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Í")
  public glyphDownItAcute(): Glyph {
    const part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerAcute())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ì")
  public glyphUpItGrave(): Glyph {
    const part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperGrave()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ì")
  public glyphDownItGrave(): Glyph {
    const part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("î")
  public glyphUpItCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUpIt().toPart(),
      this.partUpperCircumflex()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Î")
  public glyphDownItCircumflex(): Glyph {
    const part = Part.union(
      this.glyphDownIt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("o")
  public glyphUpOt(): Glyph {
    const part = Part.union(
      this.partBase(),
      this.partRightOblique(),
      this.partRightAscender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("O")
  public glyphDownOt(): Glyph {
    const part = Part.union(
      this.transposePart(this.partChippedBase()),
      this.transposePart(this.partRightOblique()),
      this.transposePart(this.partLeftDescender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ò")
  public glyphUpOtGrave(): Glyph {
    const part = Part.union(
      this.glyphUpOt().toPart(),
      this.partLowerGrave()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ò")
  public glyphDownOtGrave(): Glyph {
    const part = Part.union(
      this.glyphDownOt().toPart(),
      this.transposePart(this.partUpperGrave())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ô")
  public glyphUpOtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUpOt().toPart(),
      this.partLowerCircumflex()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ô")
  public glyphDownOtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphDownOt().toPart(),
      this.transposePart(this.partUpperCircumflex())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("u")
  public glyphUpUt(): Glyph {
    const part = Part.union(
      this.partChippedBase(),
      this.partLeftOblique(),
      this.partRightDescender()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("U")
  public glyphDownUt(): Glyph {
    const part = Part.union(
      this.transposePart(this.partBase()),
      this.transposePart(this.partLeftOblique()),
      this.transposePart(this.partLeftAscender())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("ù")
  public glyphUpUtGrave(): Glyph {
    const part = Part.union(
      this.glyphUpUt().toPart(),
      this.partUpperGrave()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Ù")
  public glyphDownUtGrave(): Glyph {
    const part = Part.union(
      this.glyphDownUt().toPart(),
      this.transposePart(this.partLowerGrave())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("û")
  public glyphUpUtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphUpUt().toPart(),
      this.partUpperCircumflex()
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("Û")
  public glyphDownUtCircumflex(): Glyph {
    const part = Part.union(
      this.glyphDownUt().toPart(),
      this.transposePart(this.partLowerCircumflex())
    );
    const spacing = this.createFixedSpacing(1, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph(",")
  public glyphTadek(): Glyph {
    const part = Part.union(
      this.partDot()
    );
    const spacing = this.createFixedSpacing(0, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph(".", "!", "?")
  public glyphDek(): Glyph {
    const part = Part.union(
      this.partDot(),
      this.partDot().translate($(this.thickness / MathUtil.sinDeg(this.obliqueAngle), 0))
    );
    const spacing = this.createFixedSpacing(0, false);
    spacing.width += this.thickness / MathUtil.sinDeg(this.obliqueAngle);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  @glyph("'", "ʻ")
  public glyphNok(): Glyph {
    const part = Part.union(
      this.partDot()
    );
    const spacing = this.createFixedSpacing(0, false);
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

  private get spaceWidth(): number {
    return this.triangleWidth * 0.5;
  }

  @glyph(" ")
  public glyphSpace(): Glyph {
    const part = Part.empty();
    const spacing = {leftEnd: 0, width: this.spaceWidth};
    const glyph = Glyph.byFixedSpacing(part, spacing);
    return glyph;
  }

}


export type GilitConfig = {
  weightConst: number,
  stretchRatio: number,
  ascenderRatio: number
};