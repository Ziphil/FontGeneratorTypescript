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
    let style = new FontStyle(this.weight, "upright", this.stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    let info = new FontInfo("Ziphil", "1.2.1");
    return info;
  }

  protected createGenerator(): VekosGenerator {
    let style = this.createStyle();
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.5 + 100) / 300;
    let stretchConst = (stretchNumber < 100) ? (stretchNumber * 0.6 + 40) / 100 : stretchNumber / 100;
    let contrastRatio = (this.high) ? 0.2 : 0.75;
    let config = {weightConst, stretchConst, contrastRatio};
    let generator = new VekosGenerator(config);
    return generator;
  }

}