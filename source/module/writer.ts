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
    const codePath = this.path + "/generate.py";
    const pythonCommand = this.config.pythonCommand ?? "python";
    await this.writeFont();
    await this.writeCode();
    await execa(pythonCommand, [codePath]);
  }

  private async writeCode(): Promise<void> {
    const extension = this.config.extension ?? "ttf";
    const autoHint = this.config.autoHint ?? true;
    const fontPath = this.path + "." + extension;
    const codePath = this.path + "/generate.py";
    let code = await fs.readFile("resource/generate.py", "utf-8");
    code = code.replace("__familyname__", "\"" + this.font.extendedFamilyName + "\"");
    code = code.replace("__fontname__", "\"" + this.font.postScriptName + "\"");
    code = code.replace("__fullname__", "\"" + this.font.fullName + "\"");
    code = code.replace("__weight__", "\"" + this.font.style.getWeightString() + "\"");
    code = code.replace("__version__", "\"" + this.font.info.version + "\"");
    code = code.replace("__copyright__", "\"" + this.font.info.copyright + "\"");
    code = code.replace("__em__", this.font.generator.metrics.em.toString());
    code = code.replace("__ascent__", this.font.generator.metrics.ascent.toString());
    code = code.replace("__descent__", this.font.generator.metrics.descent.toString());
    code = code.replace("__autohint__", (autoHint) ? "True" : "False");
    code = code.replace("__svgdir__", "\"" + this.path + "\"");
    code = code.replace("__fontfilename__", "\"" + fontPath + "\"");
    await fs.writeFile(codePath, code);
  }

  public async writeFont(): Promise<void> {
    await fs.mkdir(this.path, {recursive: true});
    const chars = this.font.generator.chars;
    const promises = chars.map(async (char) => {
      await this.writeGlyph(char);
    });
    await Promise.all(promises);
  }

  public async writeGlyph(char: string): Promise<void> {
    const generator = this.font.generator;
    const glyph = generator.glyph(char);
    const glyphPath = this.path + "/" + char.charCodeAt(0) + ".svg";
    if (glyph !== null) {
      const metrics = generator.metrics;
      const [item, width] = glyph.createItem(metrics);
      const size = new Size(metrics.em, metrics.em);
      const project = new Project(size);
      project.activeLayer.addChild(item);
      const svgString = project.exportSVG({asString: true}) as string;
      const addedSvgString = svgString.replace(/<svg(.+?)>/, `<svg$1 glyph-width="${width}">`);
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