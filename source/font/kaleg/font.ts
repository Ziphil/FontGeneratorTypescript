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
  private beaked: boolean;
  private special?: "square";

  public constructor(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean, special?: "square") {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.edgeJoin = edgeJoin;
    this.beaked = beaked;
    this.special = special;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Kaleg";
    familyName += " " + this.edgeJoin.charAt(0).toUpperCase() + this.edgeJoin.slice(1);
    if (this.beaked) {
      familyName += " Beaked";
    }
    if (this.special !== undefined) {
      familyName += " " + this.special.charAt(0).toUpperCase() + this.special.slice(1);
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
    let weightConst = (weightNumber * 0.4 + 110) / 300;
    let contrastRatio = (this.special === "square") ? 1 : 0.75;
    let edgeRatio = 0.75;
    let edgeContrastRatio = 1;
    let bowlRatio = (this.special === "square") ? (stretchNumber * 0.8 + 20) / 100 : stretchNumber * 0.8 / 100;
    let beakRatio = (this.beaked) ? 0.15 : 0;
    let legRatio = (this.beaked) ? 0 : 0;
    let tailRatio = (this.beaked) ? 0.3 : 0;
    let padekBendRatio = 0.3;
    let edgeJoin = this.edgeJoin;
    let config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, beakRatio, legRatio, tailRatio, padekBendRatio, edgeJoin};
    let generator = new KalegGenerator(config);
    return generator;
  }

}