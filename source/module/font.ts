//

import {
  FontInfo
} from "./font-info";
import {
  FontStyle
} from "./font-style";
import {
  Generator
} from "./generator";


export class Font {

  public generator: Generator;
  public familyName: string;
  public style: FontStyle;
  public info: FontInfo;

  public constructor(generator: Generator, familyName: string, style?: FontStyle, info?: FontInfo) {
    this.generator = generator;
    this.familyName = familyName;
    this.style = style ?? new FontStyle();
    this.info = info ?? new FontInfo();
  }

  public get extendedFamilyName(): string {
    return this.getModifiers(true).join(" ");
  }

  public get postScriptName(): string {
    return this.getModifiers(false).join("").replace(/\s+/g, "");
  }

  public get fullName(): string {
    return this.getModifiers(false).join(" ");
  }

  private getModifiers(onlyStretch: boolean): Array<string> {
    let modifiers = [
      this.familyName,
      this.style.getStretchString(),
      (onlyStretch) ? "" : this.style.getWeightString(),
      (onlyStretch) ? "" : this.style.getSlopeString()
    ];
    let filteredModifiers = modifiers.filter((string) => string !== "");
    return filteredModifiers;
  }

}