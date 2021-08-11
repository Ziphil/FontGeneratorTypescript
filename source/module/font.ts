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


export abstract class Font<G extends Generator = Generator> {

  public generator!: G;
  public familyName!: string;
  public style!: FontStyle;
  public info!: FontInfo;

  protected abstract createFamilyName(): string;

  protected abstract createStyle(): FontStyle;

  protected abstract createInfo(): FontInfo;

  protected abstract createGenerator(): G;

  // このクラスを継承してサブクラスを作る場合は、コンストラクタでこのメソッドを呼んでください。
  // もっと良い設計はあるはずですが、思いつきませんでした。
  protected setup(): void {
    this.generator = this.createGenerator();
    this.familyName = this.createFamilyName();
    this.style = this.createStyle();
    this.info = this.createInfo();
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