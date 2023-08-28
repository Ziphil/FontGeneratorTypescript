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
    const familyName = "Colfom";
    return familyName;
  }

  protected createStyle(): FontStyle {
    const style = new FontStyle(this.weight, "upright", this.stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    const info = new FontInfo("Ziphil", "0.0.0");
    return info;
  }

  protected createGenerator(): ColfomGenerator {
    const style = this.createStyle();
    const weightNumber = style.getWeightNumber();
    const stretchNumber = style.getStretchNumber();
    const weightConst = (weightNumber * 0.5 + 100) / 300;
    const config = {weightConst};
    const generator = new ColfomGenerator(config);
    return generator;
  }

}