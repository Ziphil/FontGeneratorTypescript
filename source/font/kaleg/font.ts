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
  KalegEdgeShape,
  KalegGenerator
} from "./generator";


export class KalegFont extends Font {

  public static create(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape, beaked: boolean): Font {
    let config = this.createConfig(weight, stretch, edgeShape, beaked);
    let generator = new KalegGenerator(config);
    let familyName = this.createFamilyName(weight, stretch, edgeShape, beaked);
    let style = this.createStyle(weight, stretch, edgeShape, beaked);
    let info = new FontInfo("Ziphil", "1.0.0");
    let font = new KalegFont(generator, familyName, style, info);
    return font;
  }

  private static createFamilyName(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape, beaked: boolean): string {
    let familyName = "Kaleg";
    if (edgeShape !== "miter") {
      familyName += " " + edgeShape.charAt(0).toUpperCase() + edgeShape.slice(1);
    }
    if (beaked) {
      familyName += " Beaked";
    }
    return familyName;
  }

  private static createStyle(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape, beaked: boolean): FontStyle {
    let style = new FontStyle(weight, "upright", stretch);
    return style;
  }

  private static createConfig(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape, beaked: boolean): KalegConfig {
    let style = this.createStyle(weight, stretch, edgeShape, beaked);
    let weightConst = 1;
    let contrastRatio = 0.75;
    let edgeRatio = 1;
    let edgeContrastRatio = contrastRatio;
    let bowlRatio = 0.8;
    let verBeakRatio = (beaked) ? 0.2 : 0;
    let horBeakRatio = (beaked) ? 0 : 0;
    let tailRatio = (beaked) ? 0.3 : 0;
    let config = {weightConst, contrastRatio, edgeRatio, edgeContrastRatio, bowlRatio, verBeakRatio, horBeakRatio, tailRatio, edgeShape};
    return config;
  }

}