//

import paper from "paper";
import {
  Size
} from "paper";
import {
  VekosGenerator
} from "./font/vekos/generator";
import {
  Font
} from "./module";
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
    let generator = new VekosGenerator({weightConst: 1, stretchConst: 1, contrastRatio: 0.75});
    let font = new Font(generator, "Vekos", {weight: "regular", slope: "upright", stretch: "normal"});
    FontWriter.writeFont(font);
  }

}


let main = new Main();
main.main();