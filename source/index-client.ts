//

import paper from "paper";
import {
  Size
} from "paper";
import {
  VekosFont
} from "./font/vekos/font";
import {
  FontStyle
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
    let font = VekosFont.create(new FontStyle("regular", "upright", "normal"), false);
    let renderer = new FontRenderer(font);
    renderer.render();
  }

}


let main = new Main();
main.main();