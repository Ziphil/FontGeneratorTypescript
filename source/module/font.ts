//

import {
  Generator
} from "./generator";


export class Font {

  public generator: Generator;
  public familyName: string;
  public style: FontStyle;
  public copyright: string;
  public version: string;

  public constructor(generator: Generator, familyName: string, style: FontStyle, copyright?: string, version?: string) {
    this.generator = generator;
    this.familyName = familyName;
    this.style = style;
    this.copyright = copyright ?? "None";
    this.version = version ?? "0.0.0";
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
      Font.stringifyFontStretch(this.style.stretch),
      (onlyStretch) ? "" : Font.stringifyFontWeight(this.style.weight),
      (onlyStretch) ? "" : Font.stringifyFontSlope(this.style.slope)
    ];
    let filteredModifiers = modifiers.filter((string) => string !== "");
    return filteredModifiers;
  }

  public static stringifyFontWeight(weight: FontWeight): string {
    return weight.charAt(0).toUpperCase() + weight.slice(1);
  }

  public static stringifyFontSlope(slope: FontSlope): string {
    if (slope === "upright") {
      return "";
    } else {
      return slope.charAt(0).toUpperCase() + slope.slice(1);
    }
  }

  public static stringifyFontStretch(stretch: FontStretch): string {
    if (stretch === "normal") {
      return "";
    } else {
      return stretch.charAt(0).toUpperCase() + stretch.slice(1);
    }
  }

}


export type FontWeight = "thin" | "extraLight" | "light" | "regular" | "medium" | "semiBold" | "bold" | "extraBold" | "heavy";
export type FontSlope = "upright" | "oblique" | "italic";
export type FontStretch = "compressed" | "condensed" | "normal" | "extended";
export type FontStyle = {weight: FontWeight, slope: FontSlope, stretch: FontStretch};