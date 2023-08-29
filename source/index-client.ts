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

  private renderer?: FontRenderer;

  public main(): void {
    this.setupPaper();
    this.setupEventListener();
    this.render();
  }

  private setupPaper(): void {
    const size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private setupEventListener(): void {
    window.addEventListener("hashchange", () => {
      this.render();
    });
  }

  private render(): void {
    const id = location.hash.substring(1);
    const fontManager = FONT_MANAGER;
    if (this.renderer === undefined) {
      const renderer = new FontRenderer(fontManager);
      this.renderer = renderer;
    }
    this.renderer.render(id);
  }

}


const main = new Main();
main.main();