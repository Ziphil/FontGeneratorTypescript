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
  private stretch: FontStretch;
  private triangle: boolean;
  private sprawled: boolean;

  public constructor(weight: FontWeight, stretch: FontStretch, triangle: boolean, sprawled: boolean) {
    super();
    this.weight = weight;
    this.stretch = stretch;
    this.triangle = triangle;
    this.sprawled = sprawled;
    this.setup();
  }

  protected createFamilyName(): string {
    let familyName = "Gilit";
    if (this.triangle) {
      familyName += " Triangle";
    }
    if (this.sprawled) {
      familyName += " Sprawled";
    }
    return familyName;
  }

  protected createStyle(): FontStyle {
    let style = new FontStyle(this.weight, "upright", this.stretch);
    return style;
  }

  protected createInfo(): FontInfo {
    let info = new FontInfo("Ziphil", "2.0.0");
    return info;
  }

  protected createGenerator(): GilitGenerator {
    let style = this.createStyle();
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.5 + 100) / 300;
    let stretchRatio = (this.triangle) ? 2 / Math.sqrt(3) : (stretchNumber - 50) / 50;
    let ascenderRatio = (this.sprawled) ? 1 : 0.5;
    let config = {weightConst, stretchRatio, ascenderRatio};
    let generator = new GilitGenerator(config);
    return generator;
  }

}