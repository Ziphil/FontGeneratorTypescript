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

  public static create(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape): Font {
    let config = this.createConfig(weight, stretch, edgeShape);
    let generator = new KalegGenerator(config);
    let familyName = this.createFamilyName(weight, stretch, edgeShape);
    let style = this.createStyle(weight, stretch, edgeShape);
    let info = new FontInfo("Ziphil", "1.0.0");
    let font = new KalegFont(generator, familyName, style, info);
    return font;
  }

  private static createFamilyName(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape): string {
    let familyName = "Kaleg";
    if (edgeShape !== "miter") {
      familyName += " " + edgeShape.charAt(0).toUpperCase() + edgeShape.slice(1);
    }
    return familyName;
  }

  private static createStyle(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape): FontStyle {
    let style = new FontStyle(weight, "upright", stretch);
    return style;
  }

  private static createConfig(weight: FontWeight, stretch: FontStretch, edgeShape: KalegEdgeShape): KalegConfig {
    let style = this.createStyle(weight, stretch, edgeShape);
    let horThickness = 100;
    let contrastRatio = 0.75;
    let bowlWidth = 500;
    let config = {horThickness, contrastRatio, bowlWidth, edgeShape};
    return config;
  }

}