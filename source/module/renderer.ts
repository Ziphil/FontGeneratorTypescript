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


const GLYPH_CANVAS_WIDTH = 90;
const GLYPH_CANVAS_HEIGHT = 80;
const PREVIEW_CANVAS_INLINE_PADDING = 8;
const PREVIEW_CANVAS_HEIGHT = 160;

const GRAY_COLOR = new Color({hue: 198, saturation: 0.5, lightness: 0.9});
const SELECTED_COLOR = new Color({hue: 35, saturation: 0.9, lightness: 0.5});
const METRICS_COLOR = new Color({hue: 35, saturation: 0.9, lightness: 0.95});


export class FontRenderer {

  private fontManager: FontManager;
  private font: Font | undefined;
  private project: Project | undefined;
  private id: string | undefined;
  private menuReady: boolean;
  private previewCanvasReady: boolean;

  public constructor(fontManager: FontManager) {
    this.fontManager = fontManager;
    this.font = undefined;
    this.id = undefined;
    this.menuReady = false;
    this.previewCanvasReady = false;
  }

  public render(id: string): void {
    this.font = this.fontManager.findById(id);
    this.id = id;
    this.setupMenu();
    this.updateMenuItem();
    this.updateFontName();
    this.setupPreviewCanvas();
    this.updatePreviewCanvas();
    this.updateGlyphPanes();
  }

  private setupMenu(): void {
    if (!this.menuReady) {
      const menuPane = document.getElementById("menu")! as HTMLDivElement;
      const fonts = this.fontManager.getAll();
      for (const [id, font] of fonts) {
        const itemPane = document.createElement("button");
        itemPane.classList.add("item");
        itemPane.id = "item-" + id;
        itemPane.textContent = font.fullName;
        itemPane.addEventListener("click", () => {
          location.href = location.search + "#" + id;
        });
        menuPane.append(itemPane);
      }
      this.menuReady = true;
    }
  }

  private updateMenuItem(): void {
    const menuPane = document.getElementById("menu")! as HTMLDivElement;
    for (let i = 0 ; i < menuPane.childNodes.length ; i ++) {
      const itemPane = menuPane.childNodes.item(i) as HTMLAnchorElement;
      if (itemPane.id === "item-" + this.id) {
        itemPane.classList.add("current");
      } else {
        itemPane.classList.remove("current");
      }
    }
  }

  private updateFontName(): void {
    const nameElement = document.getElementById("name")!;
    const familyElement = document.getElementById("family")!;
    const variantElement = document.getElementById("variant")!;
    const versionElement = document.getElementById("version")!;
    nameElement.textContent = this.font?.fullName ?? "Unknown";
    familyElement.textContent = this.id?.slice(0, 2) || "?";
    variantElement.textContent = this.id?.slice(2) || "?";
    versionElement.textContent = this.font?.info?.version || "?";
  }

  private setupPreviewCanvas(): void {
    if (!this.previewCanvasReady) {
      const input = document.getElementById("preview-text")! as HTMLInputElement;
      const wrapper = document.getElementById("preview-wrapper")! as HTMLInputElement;
      const canvas = document.getElementById("preview")! as HTMLCanvasElement;
      canvas.width = wrapper.offsetWidth - PREVIEW_CANVAS_INLINE_PADDING * 2;
      canvas.height = PREVIEW_CANVAS_HEIGHT;
      input.addEventListener("input", () => {
        history.replaceState("", document.title, location.pathname + "?preview=" + encodeURIComponent(input.value) + location.hash);
        this.renderPreview(input);
      });
      this.previewCanvasReady = true;
    }
  }

  private updatePreviewCanvas(): void {
    const input = document.getElementById("preview-text")! as HTMLInputElement;
    const project = new Project("preview");
    const previewString = queryParser.parse(location.search)["preview"] as string;
    input.value = previewString ?? "";
    this.project?.clear();
    this.project = project;
    this.renderPreview(input);
  }

  private renderPreview(input: HTMLInputElement): void {
    if (this.font !== undefined && this.project !== undefined) {
      const generator = this.font.generator;
      const scale = PREVIEW_CANVAS_HEIGHT / generator.metrics.em;
      this.project.activate();
      this.project.activeLayer.removeChildren();
      const scaledAscent = Math.floor(generator.metrics.ascent * scale);
      const baselinePath = new Path({segments: [$(0, scaledAscent), $(10000, scaledAscent)]});
      baselinePath.strokeColor = GRAY_COLOR;
      baselinePath.strokeWidth = 2;
      let position = 0;
      const items = [];
      const frontInfoGroups = [];
      const backInfoGroups = [];
      for (const char of Array.from(input.value)) {
        const glyph = generator.glyph(char);
        if (glyph !== null) {
          const [item, width] = glyph.createItem(generator.metrics);
          const metricsRectangle = new Path.Rectangle({point: $(0, 0), size: $(width * scale, generator.metrics.em * scale)});
          const metricsOverlay = metricsRectangle.clone();
          const widthText = new PointText({point: $(width * scale - 5, 15), content: Math.round(width).toString()});
          const frontInfoGroup = new Group([widthText, metricsOverlay]);
          const backInfoGroup = new Group([metricsRectangle]);
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
          widthText.fontFamily = "Asap Condensed";
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
          position += width * scale;
        }
      }
      this.project.activeLayer.addChildren([...backInfoGroups, baselinePath, ...items, ...frontInfoGroups]);
    }
  }

  private updateGlyphPanes(): void {
    if (this.font !== undefined) {
      const listElement = document.getElementById("glyph-list")!;
      const chars = this.font.generator.chars;
      chars.sort((firstChar, secondChar) => firstChar.codePointAt(0)! - secondChar.codePointAt(0)!);
      listElement.innerHTML = "";
      for (const char of chars) {
        listElement.append(this.createGlyphPane(char));
        const project = new Project(`glyph-${char.codePointAt(0)}`);
        this.renderGlyph(project, char);
      }
    }
  }

  private createGlyphPane(char: string): HTMLElement {
    const glyphPane = document.createElement("div");
    const canvas = document.createElement("canvas");
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
    const infoPane = document.createElement("div");
    const charPane = document.createElement("div");
    const codePointPane = document.createElement("div");
    const codePoint = char.codePointAt(0)!;
    infoPane.classList.add("info");
    charPane.classList.add("char");
    codePointPane.classList.add("codepoint");
    charPane.textContent = char;
    codePointPane.textContent = `U+${("000" + codePoint.toString(16)).slice(-4).toUpperCase()} · ${codePoint}`;
    infoPane.append(charPane, codePointPane);
    return infoPane;
  }

  private createBottomInfoPane(char: string): HTMLElement {
    const generator = this.font!.generator;
    const infoPane = document.createElement("div");
    const widthPane = document.createElement("div");
    const [, width] = generator.glyph(char)!.createItem(generator.metrics);
    const em = this.font!.generator.metrics.em;
    infoPane.classList.add("bottom-info");
    widthPane.classList.add("width");
    widthPane.textContent = `↔${Math.round(width)} · ↕${Math.round(em)}`;
    infoPane.append(widthPane);
    return infoPane;
  }

  private renderGlyph(project: Project, char: string): void {
    if (this.font !== undefined) {
      const generator = this.font.generator;
      const scale = GLYPH_CANVAS_HEIGHT / generator.metrics.em;
      project.activate();
      const glyph = generator.glyph(char);
      if (glyph !== null) {
        const [item, width] = glyph.createItem(generator.metrics);
        const scaledWidth = Math.floor(width * scale) + 0.5;
        const scaledAscent = Math.floor(generator.metrics.ascent * scale) + 0.5;
        const baselinePath = new Path({segments: [$(0, scaledAscent), $(GLYPH_CANVAS_WIDTH, scaledAscent)], insert: true});
        const widthPath = new Path({segments: [$(scaledWidth, 0), $(scaledWidth, GLYPH_CANVAS_HEIGHT)], insert: true});
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
  }

}