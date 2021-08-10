//

import {
  Font,
  FontInfo,
  FontStretch,
  FontStyle,
  FontWeight
} from "../../module";
import {
  KalegConfig,
  KalegEdgeJoin,
  KalegGenerator
} from "./generator";


export class KalegFont extends Font {

  public static create(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean): Font {
    let config = this.createConfig(weight, stretch, edgeJoin, beaked);
    let generator = new KalegGenerator(config);
    let familyName = this.createFamilyName(weight, stretch, edgeJoin, beaked);
    let style = this.createStyle(weight, stretch, edgeJoin, beaked);
    let info = new FontInfo("Ziphil", "1.0.0");
    let font = new KalegFont(generator, familyName, style, info);
    return font;
  }

  private static createFamilyName(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean): string {
    let familyName = "Kaleg";
    if (edgeJoin !== "miter") {
      familyName += " " + edgeJoin.charAt(0).toUpperCase() + edgeJoin.slice(1);
    }
    if (beaked) {
      familyName += " Beaked";
    }
    return familyName;
  }

  private static createStyle(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean): FontStyle {
    let style = new FontStyle(weight, "upright", stretch);
    return style;
  }

  private static createConfig(weight: FontWeight, stretch: FontStretch, edgeJoin: KalegEdgeJoin, beaked: boolean): KalegConfig {
    let style = this.createStyle(weight, stretch, edgeJoin, beaked);
    let weightNumber = style.getWeightNumber();
    let stretchNumber = style.getStretchNumber();
    let weightConst = (weightNumber * 0.45 + 100) / 300;
    let contrastRatio = 0.75;
    let edgeRatio = contrastRatio;
    let edgeContrastRatio = 1;
    let bowlRatio = 0.8;
    let verBeakRatio = (beaked) ? 0.2 : 0;
    let horBeakRatio = (beaked) ? 0 : 0;
    let tailRatio = (beaked) ? 0.3 : 0;
    let config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, verBeakRatio, horBeakRatio, tailRatio, edgeJoin};
    return config;
  }

}