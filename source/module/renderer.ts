//


import {
  Color,
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


const GLYPH_CANVAS_SIZE = 80;


export class FontRenderer {

  private font: Font;

  public constructor(font: Font) {
    this.font = font;
  }

  public render(): void {
    this.changeFontName();
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

  private changeFontName(): void {
    let nameElement = document.getElementById("name")!;
    nameElement.textContent = this.font.fullName;
  }

  private renderGlyph(char: string): void {
    let project = new Project(`glyph-${char.charCodeAt(0)}`);
    let generator = this.font.generator;
    let glyph = generator.glyph(char);
    if (glyph !== null) {
      let scale = GLYPH_CANVAS_SIZE / generator.metrics.em;
      let scaledWidth = Math.floor(glyph.width * scale) + 0.5;
      let scaledAscent = Math.floor(generator.metrics.ascent * scale) + 0.5;
      let baselinePath = new Path({segments: [new Point(0, scaledAscent), new Point(GLYPH_CANVAS_SIZE, scaledAscent)], insert: true});
      let widthPath = new Path({segments: [new Point(scaledWidth, 0), new Point(scaledWidth, GLYPH_CANVAS_SIZE)], insert: true});
      baselinePath.strokeColor = new Color({hue: 0, saturation: 0, lightness: 0.9});
      widthPath.strokeColor = new Color({hue: 0, saturation: 0, lightness: 0.9});
      baselinePath.strokeWidth = 1;
      widthPath.strokeWidth = 1;
      let item = glyph.part;
      item.scale(scale, new Point(0, 0));
      project.activeLayer.addChild(item);
      item.onMouseEnter = function (): void {
        item.selected = true;
      };
      item.onMouseLeave = function (): void {
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
    let codepointPane = document.createElement("div");
    infoPane.classList.add("info");
    charPane.classList.add("char");
    codepointPane.classList.add("codepoint");
    charPane.textContent = char;
    codepointPane.textContent = "U+" + ("000" + char.charCodeAt(0).toString(16)).slice(-4).toUpperCase();
    infoPane.append(charPane, codepointPane);
    return infoPane;
  }

}