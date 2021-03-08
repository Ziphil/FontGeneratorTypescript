//

import {
  promises as fs
} from "fs";
import {
  Project,
  Size
} from "paper";
import {
  Glyph
} from "./glyph";


export class FontWriter {

  public static async writeGlyph(glyph: Glyph, path: string): Promise<void> {
    let size = new Size(glyph.metrics.em, glyph.metrics.em);
    let project = new Project(size);
    project.activeLayer.addChild(glyph.part);
    let svgString = project.exportSVG({asString: true}) as string;
    let addedSvgString = svgString.replace(/<svg(.+?)>/, `<svg$1 glyph-width="${glyph.width}">`);
    await fs.writeFile(path, addedSvgString);
    console.log(addedSvgString);
    project.remove();
  }

}