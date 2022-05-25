//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  ColfomGenerator
} from "./generator";


export class ColfomFont extends Font<ColfomGenerator> {

  private weight: FontWeight;
  private stretch: FontStretch;

  public constructor(weight: FontWeight, stretch: FontStretch) {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Colfom";
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

  protected createGenerator(): ColfomGenerator {
    let style = this.createStyle();
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.5 + 100) / 300;
    let config = {weightConst};
    let generator = new ColfomGenerator(config);
    return generator;
  }

}