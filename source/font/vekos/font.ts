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
  private high: boolean;

  public constructor(weight: FontWeight, stretch: FontStretch, high: boolean) {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.high = high;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Vekos";
    if (this.high) {
      familyName += " High";
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
    const contrastRatio = (this.high) ? 0.2 : 0.75;
    const config = {weightConst, stretchConst, contrastRatio};
    const generator = new VekosGenerator(config);
    return generator;
  }

}