//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  VekosGenerator
} from "./generator";


export class VekosFont extends Font<VekosGenerator> {

  private weight: FontWeight;
  private stretch: FontStretch;
  private special?: "high";

  public constructor(weight: FontWeight, stretch: FontStretch, special?: "high") {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.special = special;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Vekos";
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
    const info = new FontInfo("Ziphil", "2.0.0");
    return info;
  }

  protected createGenerator(): VekosGenerator {
    const style = this.createStyle();
    const weightNumber = style.getWeightNumber();
    const stretchNumber = style.getStretchNumber();
    const weightConst = (weightNumber * 0.5 + 100) / 300;
    const stretchConst = (stretchNumber < 100) ? (stretchNumber * 0.6 + 40) / 100 : stretchNumber / 100;
    const contrastRatio = (this.special === "high") ? 0.2 : 0.75;
    const config = {weightConst, stretchConst, contrastRatio};
    const generator = new VekosGenerator(config);
    return generator;
  }

}