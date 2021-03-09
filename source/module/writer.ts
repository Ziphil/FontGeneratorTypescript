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
import {
  Glyph
} from "./glyph";


export class FontWriter {

  public static async generateFont(font: Font): Promise<void> {
    let directory = "out/" + font.fullName.replace(/\s+/g, "-").toLowerCase();
    let codePath = directory + "/generate.py";
    await FontWriter.writeCode(font);
    await execa("ffpython", [codePath]);
  }

  private static async writeCode(font: Font): Promise<void> {
    let directory = "out/" + font.fullName.replace(/\s+/g, "-").toLowerCase();
    let fontPath = directory + ".ttf";
    let codePath = directory + "/generate.py";
    let code = await fs.readFile("resource/generate.py", "utf-8");
    code = code.replace("__familyname__", "\"" + font.extendedFamilyName + "\"");
    code = code.replace("__fontname__", "\"" + font.postScriptName + "\"");
    code = code.replace("__fullname__", "\"" + font.fullName + "\"");
    code = code.replace("__weight__", "\"" + Font.stringifyFontWeight(font.style.weight) + "\"");
    code = code.replace("__version__", "\"" + font.version + "\"");
    code = code.replace("__copyright__", "\"" + font.copyright + "\"");
    code = code.replace("__em__", font.generator.metrics.em.toString());
    code = code.replace("__ascent__", font.generator.metrics.ascent.toString());
    code = code.replace("__descent__", font.generator.metrics.descent.toString());
    code = code.replace("__autohint__", "True");
    code = code.replace("__svgdir__", "\"" + directory + "\"");
    code = code.replace("__fontfilename__", "\"" + fontPath + "\"");
    await fs.writeFile(codePath, code);
  }

  public static async writeFont(font: Font): Promise<void> {
    let directory = "out/" + font.fullName.replace(/\s+/g, "-").toLowerCase();
    await fs.mkdir(directory, {recursive: true});
    let chars = font.generator.getChars();
    let promises = chars.map(async (char) => {
      let glyph = font.generator.glyph(char);
      if (glyph !== null) {
        let path = directory + "/" + char.charCodeAt(0) + ".svg";
        await FontWriter.writeGlyph(glyph, path);
      };
    });
    await Promise.all(promises);
  }

  public static async writeGlyph(glyph: Glyph, path: string): Promise<void> {
    let size = new Size(glyph.metrics.em, glyph.metrics.em);
    let project = new Project(size);
    project.activeLayer.addChild(glyph.part);
    let svgString = project.exportSVG({asString: true}) as string;
    let addedSvgString = svgString.replace(/<svg(.+?)>/, `<svg$1 glyph-width="${glyph.width}">`);
    await fs.writeFile(path, addedSvgString);
    project.remove();
  }

}