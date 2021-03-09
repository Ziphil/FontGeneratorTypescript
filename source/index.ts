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

  private async debug(): Promise<void> {
    let font = VekosFont.create(new FontStyle("regular", "upright", "normal"), false);
    let writer = new FontWriter(font);
    await writer.generate();
  }

}


let main = new Main();
main.main();