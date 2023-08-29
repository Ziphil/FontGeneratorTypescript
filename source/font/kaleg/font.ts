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
  private special?: "square" | "column";

  public constructor(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean, special?: "square" | "column") {
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
    const style = new FontStyle(this.weight, "upright", this.stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    const info = new FontInfo("Ziphil", "1.1.0");
    return info;
  }

  protected createGenerator(): KalegGenerator {
    const style = this.createStyle();
    const weightNumber = style.getWeightNumber();
    const stretchNumber = style.getStretchNumber();
    if (this.special === undefined) {
      const weightConst = (weightNumber * 0.4 + 110) / 300;
      const contrastRatio = 0.75;
      const edgeRatio = 0.75;
      const edgeContrastRatio = 1;
      const bowlRatio = stretchNumber * 0.8 / 100;
      const beakRatio = (this.beaked) ? 0.15 : 0;
      const legRatio = (this.beaked) ? 0 : 0;
      const tailRatio = (this.beaked) ? 0.3 : 0;
      const narrowBowlRatio = 0.9;
      const unbeakedTalRatio = 0.85;
      const padekBendRatio = 0.3;
      const edgeJoin = this.edgeJoin;
      const config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, beakRatio, legRatio, tailRatio, narrowBowlRatio, unbeakedTalRatio, padekBendRatio, edgeJoin};
      const generator = new KalegGenerator(config);
      return generator;
    } else if (this.special === "square") {
      const weightConst = (weightNumber * 0.4 + 110) / 300;
      const contrastRatio = 1;
      const edgeRatio = 0.75;
      const edgeContrastRatio = 1;
      const bowlRatio = (stretchNumber * 0.8 + 20) / 100;
      const beakRatio = (this.beaked) ? 0.15 : 0;
      const legRatio = (this.beaked) ? 0 : 0;
      const tailRatio = (this.beaked) ? 0.3 : 0;
      const narrowBowlRatio = 1;
      const unbeakedTalRatio = (this.beaked) ? 0.85 : 1;
      const padekBendRatio = 0.3;
      const edgeJoin = this.edgeJoin;
      const config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, beakRatio, legRatio, tailRatio, narrowBowlRatio, unbeakedTalRatio, padekBendRatio, edgeJoin};
      const generator = new KalegGenerator(config);
      return generator;
    } else if (this.special === "column") {
      const weightConst = (weightNumber * 0.4 + 110) / 300 * 0.6;
      const contrastRatio = 0.2;
      const edgeRatio = 0.2;
      const edgeContrastRatio = 1;
      const bowlRatio = 0.3;
      const beakRatio = (this.beaked) ? 0.15 : 0;
      const legRatio = (this.beaked) ? 0 : 0;
      const tailRatio = (this.beaked) ? 0.3 : 0;
      const narrowBowlRatio = 0.9;
      const unbeakedTalRatio = 0.85;
      const padekBendRatio = 0.3;
      const edgeJoin = this.edgeJoin;
      const config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, beakRatio, legRatio, tailRatio, narrowBowlRatio, unbeakedTalRatio, padekBendRatio, edgeJoin};
      const generator = new KalegGenerator(config);
      return generator;
    } else {
      throw new Error("cannot happen");
    }
  }

}