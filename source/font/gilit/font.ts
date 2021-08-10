//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  GilitConfig,
  GilitGenerator
} from "./generator";


export class GilitFont extends Font {

  public static create(weight: FontWeight, stretch: FontStretch, triangle: boolean, sprawled: boolean): Font {
    let config = this.createConfig(weight, stretch, triangle, sprawled);
    let generator = new GilitGenerator(config);
    let familyName = this.createFamilyName(weight, stretch, triangle, sprawled);
    let style = this.createStyle(weight, stretch, triangle, sprawled);
    let info = new FontInfo("Ziphil", "1.2.1");
    let font = new GilitFont(generator, familyName, style, info);
    return font;
  }

  private static createFamilyName(weight: FontWeight, stretch: FontStretch, triangle: boolean, sprawled: boolean): string {
    let familyName = "Gilit";
    if (triangle) {
      familyName += " Triangle";
    }
    if (sprawled) {
      familyName += " Sprawled";
    }
    return familyName;
  }

  private static createStyle(weight: FontWeight, stretch: FontStretch, triangle: boolean, sprawled: boolean): FontStyle {
    let style = new FontStyle(weight, "upright", stretch);
    return style;
  }

  private static createConfig(weight: FontWeight, stretch: FontStretch, triangle: boolean, sprawled: boolean): GilitConfig {
    let style = this.createStyle(weight, stretch, triangle, sprawled);
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.5 + 100) / 300;
    let stretchRatio = (triangle) ? 2 / Math.sqrt(3) : (stretchNumber - 50) / 50;
    let ascenderRatio = (sprawled) ? 1 : 0.5;
    let config = {weightConst, stretchRatio, ascenderRatio};
    return config;
  }

}