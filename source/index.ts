//

import chalk from "chalk";
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
    let options = argsParser([
      {name: "list", alias: "l", type: Boolean},
      {name: "id", alias: "i", multiple: true, defaultOption: true},
      {name: "python", alias: "p"}
    ]);
    if (options["list"]) {
      this.listFonts();
    } else {
      this.setupPaper();
      this.generate(options);
    }
  }

  private setupPaper(): void {
    let size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private listFonts(): void {
    let fonts = FONT_MANAGER.getAll();
    let maxFullNameLength = Math.max(...fonts.map(([, font]) => font.fullName.length));
    let fontStrings = fonts.map(([id, font]) => {
      let fontString = chalk.green(id.padEnd(5)) + "  " + font.fullName;
      return fontString;
    });
    let output = fontStrings.join("\n");
    console.log(output);
  }

  private async generate(options: any): Promise<void> {
    let pythonCommand = options["python"];
    let ids = options["id"];
    let fonts = (ids === undefined) ? FONT_MANAGER.getAll() : FONT_MANAGER.getAll().filter(([id]) => ids.includes(id));
    let count = 0;
    let promises = fonts.map(async ([id, font]) => {
      let writer = new FontWriter(font, {pythonCommand});
      await writer.generate();
      count ++;
      let countString = chalk.cyan("[" + count.toString().padStart(2) + "/" + fonts.length.toString().padStart(2) + "]");
      let output = countString + " " + chalk.green(id.padEnd(5)) + "  " + font.fullName;
      console.log(output);
    });
    await Promise.all(promises);
  }

}


let main = new Main();
main.main();