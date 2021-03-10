//


export class FontStyle {

  public weight: FontWeight;
  public slope: FontSlope;
  public stretch: FontStretch;

  public constructor(weight?: FontWeight, slope?: FontSlope, stretch?: FontStretch) {
    this.weight = weight ?? "regular";
    this.slope = slope ?? "upright";
    this.stretch = stretch ?? "normal";
  }

  public getWeightNumber(): number {
    let weight = this.weight;
    if (weight === "thin") {
      return 100;
    } else if (weight === "extraLight") {
      return 200;
    } else if (weight === "light") {
      return 300;
    } else if (weight === "regular") {
      return 400;
    } else if (weight === "medium") {
      return 500;
    } else if (weight === "semiBold") {
      return 600;
    } else if (weight === "bold") {
      return 700;
    } else if (weight === "extraBold") {
      return 800;
    } else if (weight === "heavy") {
      return 900;
    } else {
      throw new Error("cannot happen");
    }
  }

  public getStretchNumber(): number {
    let stretch = this.stretch;
    if (stretch === "ultraCondensed") {
      return 50;
    } else if (stretch === "extraCondensed") {
      return 62.5;
    } else if (stretch === "condensed") {
      return 75;
    } else if (stretch === "semiCondensed") {
      return 87.5;
    } else if (stretch === "normal") {
      return 100;
    } else if (stretch === "semiExpanded") {
      return 112.5;
    } else if (stretch === "expanded") {
      return 125;
    } else if (stretch === "extraExpanded") {
      return 150;
    } else if (stretch === "ultraExpanded") {
      return 200;
    } else {
      throw new Error("cannot happen");
    }
  }

  public getWeightString(): string {
    let weight = this.weight;
    return weight.charAt(0).toUpperCase() + weight.slice(1);
  }

  public getSlopeString(): string {
    let slope = this.slope;
    if (slope === "upright") {
      return "";
    } else {
      return slope.charAt(0).toUpperCase() + slope.slice(1);
    }
  }

  public getStretchString(): string {
    let stretch = this.stretch;
    if (stretch === "normal") {
      return "";
    } else {
      return stretch.charAt(0).toUpperCase() + stretch.slice(1);
    }
  }

}


export type FontWeight = "thin" | "extraLight" | "light" | "regular" | "medium" | "semiBold" | "bold" | "extraBold" | "heavy";
export type FontSlope = "upright" | "oblique" | "italic";
export type FontStretch = "ultraCondensed" | "extraCondensed" | "condensed" | "semiCondensed" | "normal" | "semiExpanded" | "expanded" | "extraExpanded" | "ultraExpanded";