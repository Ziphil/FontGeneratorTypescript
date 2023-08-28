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
    const options = argsParser([
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
    const size = new Size(100, 100);
    paper.settings.insertItems = false;
    paper.setup(size);
  }

  private listFonts(): void {
    const fonts = FONT_MANAGER.getAll();
    const maxFullNameLength = Math.max(...fonts.map(([, font]) => font.fullName.length));
    const fontStrings = fonts.map(([id, font]) => {
      const fontString = chalk.green(id.padEnd(5)) + "  " + font.fullName;
      return fontString;
    });
    const output = fontStrings.join("\n");
    console.log(output);
  }

  private async generate(options: any): Promise<void> {
    const pythonCommand = options["python"];
    const ids = options["id"];
    const fonts = (ids === undefined) ? FONT_MANAGER.getAll() : FONT_MANAGER.getAll().filter(([id]) => ids.includes(id));
    let count = 0;
    const promises = fonts.map(async ([id, font]) => {
      const writer = new FontWriter(font, {pythonCommand});
      await writer.generate();
      count ++;
      const countString = chalk.cyan("[" + count.toString().padStart(2) + "/" + fonts.length.toString().padStart(2) + "]");
      const output = countString + " " + chalk.green(id.padEnd(5)) + "  " + font.fullName;
      console.log(output);
    });
    await Promise.all(promises);
  }

}


const main = new Main();
main.main();