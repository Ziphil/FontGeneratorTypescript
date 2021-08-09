//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  VekosConfig,
  VekosGenerator
} from "./generator";


export class VekosFont extends Font {

  public static create(weight: FontWeight, stretch: FontStretch, high: boolean): Font {
    let config = this.createConfig(weight, stretch, high);
    let generator = new VekosGenerator(config);
    let familyName = this.createFamilyName(weight, stretch, high);
    let style = this.createStyle(weight, stretch, high);
    let info = new FontInfo("Ziphil", "1.2.0");
    let font = new VekosFont(generator, familyName, style, info);
    return font;
  }

  private static createFamilyName(weight: FontWeight, stretch: FontStretch, high: boolean): string {
    let familyName = "Vekos";
    if (high) {
      familyName += " High";
    }
    return familyName;
  }

  private static createStyle(weight: FontWeight, stretch: FontStretch, high: boolean): FontStyle {
    let style = new FontStyle(weight, "upright", stretch);
    return style;
  }

  private static createConfig(weight: FontWeight, stretch: FontStretch, high: boolean): VekosConfig {
    let style = this.createStyle(weight, stretch, high);
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.5 + 100) / 300;
    let stretchConst = (stretchNumber < 100) ? (stretchNumber * 0.6 + 40) / 100 : stretchNumber / 100;
    let contrastRatio = (high) ? 0.2 : 0.75;
    let config = {weightConst, stretchConst, contrastRatio};
    return config;
  }

}