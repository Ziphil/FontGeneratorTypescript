//

import execa from "execa";
import {
  promises as fs
} from "fs";
import {
  Project,
  Size
} from "paper";
import {
  Font
} from "./font";


export class FontWriter {

  private font: Font;
  private config: FontWriterConfig;
  private path: string;

  public constructor(font: Font, config: FontWriterConfig = {}) {
    this.font = font;
    this.config = config;
    this.path = "out/" + font.fullName.replace(/\s+/g, "-").toLowerCase();
  }

  public async generate(): Promise<void> {
    let codePath = this.path + "/generate.py";
    let pythonCommand = this.config.pythonCommand ?? "python";
    await this.writeFont();
    await this.writeCode();
    await execa(pythonCommand, [codePath]);
  }

  private async writeCode(): Promise<void> {
    let extension = this.config.extension ?? "ttf";
    let autoHint = this.config.autoHint ?? true;
    let fontPath = this.path + "." + extension;
    let codePath = this.path + "/generate.py";
    let code = await fs.readFile("resource/generate.py", "utf-8");
    code = code.replace("__familyname__", "\"" + this.font.extendedFamilyName + "\"");
    code = code.replace("__fontname__", "\"" + this.font.postScriptName + "\"");
    code = code.replace("__fullname__", "\"" + this.font.fullName + "\"");
    code = code.replace("__weight__", "\"" + this.font.style.getWeightString() + "\"");
    code = code.replace("__version__", "\"" + this.font.info.version + "\"");
    code = code.replace("__copyright__", "\"" + this.font.info.copyright + "\"");
    code = code.replace("__em__", this.font.generator.getMetrics().em.toString());
    code = code.replace("__ascent__", this.font.generator.getMetrics().ascent.toString());
    code = code.replace("__descent__", this.font.generator.getMetrics().descent.toString());
    code = code.replace("__autohint__", (autoHint) ? "True" : "False");
    code = code.replace("__svgdir__", "\"" + this.path + "\"");
    code = code.replace("__fontfilename__", "\"" + fontPath + "\"");
    await fs.writeFile(codePath, code);
  }

  public async writeFont(): Promise<void> {
    await fs.mkdir(this.path, {recursive: true});
    let chars = this.font.generator.getChars();
    let promises = chars.map(async (char) => {
      await this.writeGlyph(char);
    });
    await Promise.all(promises);
  }

  public async writeGlyph(char: string): Promise<void> {
    let glyph = this.font.generator.glyph(char);
    let glyphPath = this.path + "/" + char.charCodeAt(0) + ".svg";
    if (glyph !== null) {
      let size = new Size(glyph.metrics.em, glyph.metrics.em);
      let project = new Project(size);
      project.activeLayer.addChild(glyph.item);
      let svgString = project.exportSVG({asString: true}) as string;
      let addedSvgString = svgString.replace(/<svg(.+?)>/, `<svg$1 glyph-width="${glyph.width}">`);
      await fs.writeFile(glyphPath, addedSvgString);
      project.remove();
    }
  }

}


export type FontWriterConfig = {
  extension?: string,
  autoHint?: boolean,
  pythonCommand?: string
};