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
    let size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private render(): void {
    let id = location.pathname.substring(1);
    let fontManager = FONT_MANAGER;
    let renderer = new FontRenderer(fontManager, id);
    renderer.render();
  }

}


let main = new Main();
main.main();