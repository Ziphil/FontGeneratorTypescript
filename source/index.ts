//

import fs from "fs";
import {
  Project,
  Size
} from "paper";
import {
  VekosFont
} from "./font/vekos";


export class Main {

  public main(): void {
    let font = new VekosFont({weightConst: 1, stretchConst: 1, contrastRatio: 0.75});
    let size = new Size(1000, 1000);
    let project = new Project(size);
    font.partLes();
    let svg = project.exportSVG({asString: true}) as string;
    fs.writeFile("out/test.svg", svg, () => {
      console.log(svg);
    });
  }

}


let main = new Main();
main.main();