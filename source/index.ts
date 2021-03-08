//

import paper from "paper";
import {
  Size
} from "paper";
import {
  VekosFont
} from "./font/vekos";
import {
  FontWriter
} from "./module/writer";


export class Main {

  public main(): void {
    let font = new VekosFont({weightConst: 1, stretchConst: 1, contrastRatio: 0.75});
    let size = new Size(0, 0);
    paper.setup(size);
    FontWriter.writeGlyph(font.glyphLes(), "out/test.svg");
  }

}


let main = new Main();
main.main();