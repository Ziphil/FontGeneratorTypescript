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
const PREVIEW_CANVAS_WIDTH = 834;
const PREVIEW_CANVAS_HEIGHT = 150;


export class FontRenderer {

  private font: Font;

  public constructor(font: Font) {
    this.font = font;
  }

  public render(): void {
    this.setupPreviewCanvas();
    this.setupFontName();
    this.appendGlyphPane();
  }

  private setupPreviewCanvas(): void {
    let input = document.getElementById("preview-text")! as HTMLInputElement;
    let canvas = document.getElementById("preview")! as HTMLCanvasElement;
    canvas.width = PREVIEW_CANVAS_WIDTH;
    canvas.height = PREVIEW_CANVAS_HEIGHT;
    let project = new Project("preview");
    this.renderPreview(project, input);
    input.addEventListener("input", () => {
      this.renderPreview(project, input);
    });
  }

  private renderPreview(project: Project, input: HTMLInputElement): void {
    let generator = this.font.generator;
    let scale = PREVIEW_CANVAS_HEIGHT / generator.metrics.em;
    project.activate();
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
        item.onMouseEnter = function (): void {
          item.selected = true;
        };
        item.onMouseLeave = function (): void {
          item.selected = false;
        };
        position += glyph.width * scale;
      }
    }
  }

  private appendGlyphPane(): void {
    let listElement = document.getElementById("glyph-list")!;
    let chars = this.font.generator.getChars();
    chars.sort((firstChar, secondChar) => firstChar.codePointAt(0)! - secondChar.codePointAt(0)!);
    for (let char of chars) {
      listElement.append(this.createGlyphPane(char));
      let project = new Project(`glyph-${char.codePointAt(0)}`);
      this.renderGlyph(project, char);
    }
  }

  private setupFontName(): void {
    let nameElement = document.getElementById("name")!;
    nameElement.textContent = this.font.fullName;
  }

  private renderGlyph(project: Project, char: string): void {
    let generator = this.font.generator;
    let scale = GLYPH_CANVAS_HEIGHT / generator.metrics.em;
    project.activate();
    let glyph = generator.glyph(char);
    if (glyph !== null) {
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
    canvas.id = `glyph-${char.codePointAt(0)}`;
    canvas.width = GLYPH_CANVAS_WIDTH;
    canvas.height = GLYPH_CANVAS_HEIGHT;
    glyphPane.append(this.createInfoPane(char));
    glyphPane.append(canvas);
    glyphPane.append(this.createBottomInfoPane(char));
    return glyphPane;
  }

  private createInfoPane(char: string): HTMLElement {
    let infoPane = document.createElement("div");
    let charPane = document.createElement("div");
    let codePointPane = document.createElement("div");
    let codePoint = char.codePointAt(0)!;
    infoPane.classList.add("info");
    charPane.classList.add("char");
    codePointPane.classList.add("codepoint");
    charPane.textContent = char;
    codePointPane.textContent = `U+${("000" + codePoint.toString(16)).slice(-4).toUpperCase()} · ${codePoint}`;
    infoPane.append(charPane, codePointPane);
    return infoPane;
  }

  private createBottomInfoPane(char: string): HTMLElement {
    let infoPane = document.createElement("div");
    let widthPane = document.createElement("div");
    let width = this.font.generator.glyph(char)!.width;
    let em = this.font.generator.metrics.em;
    infoPane.classList.add("bottom-info");
    widthPane.classList.add("width");
    widthPane.textContent = `↔${Math.round(width)} · ↕${Math.round(em)}`;
    infoPane.append(widthPane);
    return infoPane;
  }

}