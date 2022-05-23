//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  KalegEdgeJoin,
  KalegGenerator
} from "./generator";


export class KalegFont extends Font<KalegGenerator> {

  private weight: FontWeight;
  private stretch: FontStretch;
  private edgeJoin: KalegEdgeJoin;
  private square: boolean;
  private beaked: boolean;

  public constructor(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, square: boolean, beaked: boolean) {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.edgeJoin = edgeJoin;
    this.square = square;
    this.beaked = beaked;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Kaleg";
    familyName += " " + this.edgeJoin.charAt(0).toUpperCase() + this.edgeJoin.slice(1);
    if (this.beaked) {
      familyName += " Beaked";
    }
    if (this.square) {
      familyName += " Square";
    }
    return familyName;
  }

  protected createStyle(): FontStyle {
    let style = new FontStyle(this.weight, "upright", this.stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    let info = new FontInfo("Ziphil", "0.0.0");
    return info;
  }

  protected createGenerator(): KalegGenerator {
    let style = this.createStyle();
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.45 + 100) / 300;
    let contrastRatio = 0.75;
    let edgeRatio = contrastRatio;
    let edgeContrastRatio = 1;
    let bowlRatio = (this.square) ? 1 : stretchNumber * 0.018 - 1;
    let beakRatio = (this.beaked) ? 0.2 : 0;
    let legRatio = (this.beaked) ? 0 : 0;
    let tailRatio = (this.beaked) ? 0.3 : 0;
    let padekBendRatio = 0.3;
    let edgeJoin = this.edgeJoin;
    let config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, beakRatio, legRatio, tailRatio, padekBendRatio, edgeJoin};
    let generator = new KalegGenerator(config);
    return generator;
  }

}