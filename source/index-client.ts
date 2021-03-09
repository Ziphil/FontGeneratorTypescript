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
  FontRenderer
} from "./module/renderer";


export class Main {

  public main(): void {
    this.setupPaper();
    this.render();
  }

  private setupPaper(): void {
    let size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private render(): void {
    let generator = new VekosGenerator({weightConst: 1, stretchConst: 1, contrastRatio: 0.75});
    let font = new Font(generator, "Vekos", {weight: "regular", slope: "upright", stretch: "normal"});
    let renderer = new FontRenderer(font);
    renderer.render();
  }

}


let main = new Main();
main.main();