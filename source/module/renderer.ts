//


import {
  Path,
  Point,
  Project,
  Size
} from "paper";
import {
  Font
} from "./font";
import {
  Glyph
} from "./glyph";


const GLYPH_CANVAS_SIZE = 150;


export class FontRenderer {

  private font: Font;

  public constructor(font: Font) {
    this.font = font;
  }

  public render(): void {
    this.appendGlyphPane();
  }

  private appendGlyphPane(): void {
    let listElement = document.getElementById("glyph-list")!;
    let chars = this.font.generator.getChars();
    chars.sort((firstChar, secondChar) => firstChar.charCodeAt(0) - secondChar.charCodeAt(0));
    for (let char of chars) {
      listElement.append(this.createGlyphPane(char));
      this.renderGlyph(char);
    }
  }

  private renderGlyph(char: string): void {
    let project = new Project(`glyph-${char.charCodeAt(0)}`);
    let generator = this.font.generator;
    let glyph = generator.glyph(char);
    if (glyph !== null) {
      let item = glyph.part;
      item.scale(GLYPH_CANVAS_SIZE / generator.metrics.em, new Point(0, 0));
      project.activeLayer.addChild(item);
      project.activeLayer.onMouseEnter = function (): void {
        item.selected = true;
      };
      project.activeLayer.onMouseLeave = function (): void {
        item.selected = false;
      };
    }
  }

  private createGlyphPane(char: string): HTMLElement {
    let glyphPane = document.createElement("div");
    let canvas = document.createElement("canvas");
    glyphPane.classList.add("glyph-pane");
    canvas.id = `glyph-${char.charCodeAt(0)}`;
    canvas.width = GLYPH_CANVAS_SIZE;
    canvas.height = GLYPH_CANVAS_SIZE;
    glyphPane.append(this.createInfoPane(char));
    glyphPane.append(canvas);
    return glyphPane;
  }

  private createInfoPane(char: string): HTMLElement {
    let infoPane = document.createElement("div");
    let charPane = document.createElement("div");
    infoPane.classList.add("info");
    charPane.classList.add("char");
    charPane.textContent = char;
    infoPane.append(charPane);
    return infoPane;
  }

}