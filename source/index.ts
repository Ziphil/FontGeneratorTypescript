//

import paper from "paper";
import {
  Size
} from "paper";
import {
  FONTS
} from "./font";
import {
  FontWriter
} from "./module/writer";


export class Main {

  public main(): void {
    this.setupPaper();
    this.generate();
  }

  private setupPaper(): void {
    let size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private async generate(): Promise<void> {
    let fontFunctions = Object.values(FONTS);
    let promises = fontFunctions.map(async (fontFunction) => {
      let font = fontFunction();
      let writer = new FontWriter(font);
      await writer.generate();
    });
    await Promise.all(promises);
  }

}


let main = new Main();
main.main();