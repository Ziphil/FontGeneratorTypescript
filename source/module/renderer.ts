//

import {
  Color,
  Group,
  Path,
  PointText,
  Project
} from "paper";
import queryParser from "query-string";
import {
  Font
} from "./font";
import {
  FontManager
} from "./font-manager";
import {
  $
} from "./point";


const GLYPH_CANVAS_WIDTH = 80;
const GLYPH_CANVAS_HEIGHT = 80;
const PREVIEW_CANVAS_WIDTH = 834;
const PREVIEW_CANVAS_HEIGHT = 150;

const GRAY_COLOR = new Color({hue: 0, saturation: 0, lightness: 0.85});
const SELECTED_COLOR = new Color({hue: 200, saturation: 0.8, lightness: 0.5});
const METRICS_COLOR = new Color({hue: 200, saturation: 0.8, lightness: 0.95});


export class FontRenderer {

  private fontManager: FontManager;
  private font: Font | undefined;
  private id: string;

  public constructor(fontManager: FontManager, id: string) {
    this.fontManager = fontManager;
    this.font = fontManager.findById(id);
    this.id = id;
  }

  public render(): void {
    this.setupMenu();
    if (this.font !== undefined) {
      this.setupMenuItem();
      this.setupPreviewCanvas();
      this.setupFontName();
      this.appendGlyphPane();
    }
  }

  private setupMenu(): void {
    let menuPane = document.getElementById("menu")! as HTMLDivElement;
    let fonts = this.fontManager.getAll();
    for (let [id, font] of fonts) {
      let itemPane = document.createElement("div");
      itemPane.classList.add("item");
      itemPane.id = "item-" + id;
      itemPane.textContent = font.fullName;
      itemPane.addEventListener("click", () => {
        location.href = "/" + id + location.search;
      });
      menuPane.append(itemPane);
    }
  }

  private setupMenuItem(): void {
    let itemPane = document.getElementById("item-" + this.id);
    itemPane?.classList.add("current");
  }

  private setupPreviewCanvas(): void {
    let input = document.getElementById("preview-text")! as HTMLInputElement;
    let canvas = document.getElementById("preview")! as HTMLCanvasElement;
    canvas.width = PREVIEW_CANVAS_WIDTH;
    canvas.height = PREVIEW_CANVAS_HEIGHT;
    let project = new Project("preview");
    let previewString = queryParser.parse(location.search)["preview"] as string;
    input.value = previewString ?? "";
    this.renderPreview(project, input);
    input.addEventListener("input", () => {
      history.replaceState("", document.title, location.pathname + "?preview=" + encodeURIComponent(input.value));
      this.renderPreview(project, input);
    });
  }

  private renderPreview(project: Project, input: HTMLInputElement): void {
    let generator = this.font!.generator;
    let scale = PREVIEW_CANVAS_HEIGHT / generator.getMetrics().em;
    project.activate();
    project.activeLayer.removeChildren();
    let scaledAscent = Math.floor(generator.getMetrics().ascent * scale);
    let baselinePath = new Path({segments: [$(0, scaledAscent), $(10000, scaledAscent)]});
    baselinePath.strokeColor = GRAY_COLOR;
    baselinePath.strokeWidth = 2;
    let position = 0;
    let items = [];
    let frontInfoGroups = [];
    let backInfoGroups = [];
    for (let char of Array.from(input.value)) {
      let glyph = generator.glyph(char);
      if (glyph !== null) {
        let item = glyph.item;
        let metricsRectangle = new Path.Rectangle({point: $(0, 0), size: $(glyph.width * scale, generator.getMetrics().em * scale)});
        let metricsOverlay = metricsRectangle.clone();
        let widthText = new PointText({point: $(glyph.width * scale - 5, 15), content: Math.round(glyph.width).toString()});
        let frontInfoGroup = new Group([widthText, metricsOverlay]);
        let backInfoGroup = new Group([metricsRectangle]);
        items.push(item);
        frontInfoGroups.push(frontInfoGroup);
        backInfoGroups.push(backInfoGroup);
        item.scale(scale, $(0, 0));
        item.translate($(position, 0));
        frontInfoGroup.translate($(position, 0));
        backInfoGroup.translate($(position, 0));
        item.selectedColor = SELECTED_COLOR;
        metricsRectangle.fillColor = METRICS_COLOR;
        metricsOverlay.fillColor = METRICS_COLOR;
        metricsOverlay.opacity = 0;
        widthText.fontFamily = "Alegreya Sans";
        widthText.fontSize = 16 * 0.75;
        widthText.fillColor = SELECTED_COLOR;
        widthText.justification = "right";
        frontInfoGroup.opacity = 0;
        backInfoGroup.opacity = 0;
        metricsOverlay.on("mouseenter", () => {
          item.selected = true;
          frontInfoGroup.opacity = 1;
          backInfoGroup.opacity = 1;
        });
        metricsOverlay.on("mouseleave", () => {
          item.selected = false;
          frontInfoGroup.opacity = 0;
          backInfoGroup.opacity = 0;
        });
        position += glyph.width * scale;
      }
    }
    project.activeLayer.addChildren([...backInfoGroups, baselinePath, ...items, ...frontInfoGroups]);
  }

  private appendGlyphPane(): void {
    let listElement = document.getElementById("glyph-list")!;
    let chars = this.font!.generator.getChars();
    chars.sort((firstChar, secondChar) => firstChar.codePointAt(0)! - secondChar.codePointAt(0)!);
    for (let char of chars) {
      listElement.append(this.createGlyphPane(char));
      let project = new Project(`glyph-${char.codePointAt(0)}`);
      this.renderGlyph(project, char);
    }
  }

  private setupFontName(): void {
    let nameElement = document.getElementById("name")!;
    let idElement = document.getElementById("id")!;
    let versionElement = document.getElementById("version")!;
    nameElement.textContent = this.font!.fullName;
    idElement.textContent = this.id;
    versionElement.textContent = this.font!.info.version;
  }

  private renderGlyph(project: Project, char: string): void {
    let generator = this.font!.generator;
    let scale = GLYPH_CANVAS_HEIGHT / generator.getMetrics().em;
    project.activate();
    let glyph = generator.glyph(char);
    if (glyph !== null) {
      let scaledWidth = Math.floor(glyph.width * scale) + 0.5;
      let scaledAscent = Math.floor(generator.getMetrics().ascent * scale) + 0.5;
      let item = glyph.item;
      let baselinePath = new Path({segments: [$(0, scaledAscent), $(GLYPH_CANVAS_WIDTH, scaledAscent)], insert: true});
      let widthPath = new Path({segments: [$(scaledWidth, 0), $(scaledWidth, GLYPH_CANVAS_HEIGHT)], insert: true});
      item.scale(scale, $(0, 0));
      item.selectedColor = SELECTED_COLOR;
      baselinePath.strokeColor = GRAY_COLOR;
      widthPath.strokeColor = GRAY_COLOR;
      baselinePath.strokeWidth = 1;
      widthPath.strokeWidth = 1;
      item.on("mouseenter", () => {
        item.selected = true;
      });
      item.on("mouseleave", () => {
        item.selected = false;
      });
      project.activeLayer.addChild(item);
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
    let width = this.font!.generator.glyph(char)!.width;
    let em = this.font!.generator.getMetrics().em;
    infoPane.classList.add("bottom-info");
    widthPane.classList.add("width");
    widthPane.textContent = `↔${Math.round(width)} · ↕${Math.round(em)}`;
    infoPane.append(widthPane);
    return infoPane;
  }

}