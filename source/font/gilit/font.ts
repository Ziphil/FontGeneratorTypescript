//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  GilitGenerator
} from "./generator";


export class GilitFont extends Font<GilitGenerator> {

  private weight: FontWeight;
  private stretch: FontStretch | "triangle";
  private sprawled: boolean;

  public constructor(weight: FontWeight, stretch: FontStretch | "triangle", sprawled: boolean) {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.sprawled = sprawled;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Gilit";
    if (this.stretch === "triangle") {
      familyName += " Triangle";
    }
    if (this.sprawled) {
      familyName += " Sprawled";
    }
    return familyName;
  }

  protected createStyle(): FontStyle {
    const stretch = (this.stretch === "triangle") ? "normal" : this.stretch;
    const style = new FontStyle(this.weight, "upright", stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    const info = new FontInfo("Ziphil", "2.0.0");
    return info;
  }

  protected createGenerator(): GilitGenerator {
    const style = this.createStyle();
    const weightNumber = style.getWeightNumber();
    const stretchNumber = style.getStretchNumber();
    const weightConst = (weightNumber * 0.5 + 100) / 300;
    const stretchRatio = (this.stretch === "triangle") ? 2 / Math.sqrt(3) : (stretchNumber - 50) / 50;
    const ascenderRatio = (this.sprawled) ? 1 : 0.5;
    const config = {weightConst, stretchRatio, ascenderRatio};
    const generator = new GilitGenerator(config);
    return generator;
  }

}