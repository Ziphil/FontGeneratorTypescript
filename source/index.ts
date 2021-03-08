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
    this.setupPaper();
    this.debug();
  }

  private setupPaper(): void {
    let size = new Size(1000, 1000);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private debug(): void {
    let font = new VekosFont({weightConst: 1, stretchConst: 1, contrastRatio: 0.75});
    FontWriter.writeGlyph(font.glyphLes(), "out/test.svg");
  }

}


let main = new Main();
main.main();