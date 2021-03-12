//

import argsParser from "command-line-args";
import paper from "paper";
import {
  Size
} from "paper";
import {
  FONT_MANAGER
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
    let options = argsParser([{name: "python", alias: "p"}]);
    let pythonCommand = options["python"];
    let fonts = FONT_MANAGER.getAll();
    let promises = fonts.map(async ([, font]) => {
      let writer = new FontWriter(font, {pythonCommand});
      await writer.generate();
    });
    await Promise.all(promises);
  }

}


let main = new Main();
main.main();