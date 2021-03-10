//

import paper from "paper";
import {
  Size
} from "paper";
import {
  FONTS
} from "./font";
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
    let font = FONTS.vkr();
    let renderer = new FontRenderer(font);
    renderer.render();
  }

}


let main = new Main();
main.main();