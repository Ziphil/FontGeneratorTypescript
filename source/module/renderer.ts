//


import {
  Color,
  Path,
  Point,
  Project
} from "paper";
import {
  Font
} from "./font";


const GLYPH_CANVAS_WIDTH = 80;
const GLYPH_CANVAS_HEIGHT = 80;
const PREVIEW_CANVAS_HEIGHT = 150;


export class FontRenderer {

  private font: Font;

  public constructor(font: Font) {
    this.font = font;
  }

  public render(): void {
    this.changeFontName();
    this.appendGlyphPane();
    this.setupPreviewCanvas();
  }

  private setupPreviewCanvas(): void {
    let input = document.getElementById("preview-text")! as HTMLInputElement;
    let canvas = document.getElementById("preview")! as HTMLCanvasElement;
    let project = new Project("preview");
    canvas.height = PREVIEW_CANVAS_HEIGHT;
    input.addEventListener("input", () => {
      this.updatePreviewCanvas(project, input);
    });
    this.updatePreviewCanvas(project, input);
  }

  private updatePreviewCanvas(project: Project, input: HTMLInputElement): void {
    let generator = this.font.generator;
    let scale = PREVIEW_CANVAS_HEIGHT / generator.metrics.em;
    project.activeLayer.removeChildren();
    let scaledAscent = Math.floor(generator.metrics.ascent * scale);
    let baselinePath = new Path({segments: [new Point(0, scaledAscent), new Point(10000, scaledAscent)], insert: true});
    baselinePath.strokeColor = new Color({hue: 0, saturation: 0, lightness: 0.9});
    baselinePath.strokeWidth = 2;
    let position = 0;
    for (let char of Array.from(input.value)) {
      let glyph = generator.glyph(char);
      if (glyph !== null) {
        let item = glyph.part;
        item.scale(scale, new Point(0, 0));
        item.translate(new Point(position, 0));
        project.activeLayer.addChild(item);
        position += glyph.width * scale;
      }
    }
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
      let scale = GLYPH_CANVAS_HEIGHT / generator.metrics.em;
      let scaledWidth = Math.floor(glyph.width * scale) + 0.5;
      let scaledAscent = Math.floor(generator.metrics.ascent * scale) + 0.5;
      let baselinePath = new Path({segments: [new Point(0, scaledAscent), new Point(GLYPH_CANVAS_WIDTH, scaledAscent)], insert: true});
      let widthPath = new Path({segments: [new Point(scaledWidth, 0), new Point(scaledWidth, GLYPH_CANVAS_HEIGHT)], insert: true});
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
    canvas.width = GLYPH_CANVAS_WIDTH;
    canvas.height = GLYPH_CANVAS_HEIGHT;
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