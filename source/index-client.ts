//

import paper from "paper";
import {
  Size
} from "paper";
import {
  FONT_MANAGER
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
    const size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private render(): void {
    const id = location.pathname.substring(1);
    const fontManager = FONT_MANAGER;
    const renderer = new FontRenderer(fontManager, id);
    renderer.render();
  }

}


const main = new Main();
main.main();