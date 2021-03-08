//

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