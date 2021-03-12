//

import {
  FontManager
} from "../module";
import {
  VekosFont
} from "./vekos/font";


const FONTS = {
  vkr: VekosFont.create("regular", "normal", false),
  vkb: VekosFont.create("bold", "normal", false),
  vkt: VekosFont.create("thin", "normal", false),
  vkcr: VekosFont.create("regular", "condensed", false),
  vkcb: VekosFont.create("bold", "condensed", false),
  vkct: VekosFont.create("thin", "condensed", false),
  vker: VekosFont.create("regular", "expanded", false),
  vkeb: VekosFont.create("bold", "expanded", false),
  vket: VekosFont.create("thin", "expanded", false),
  vkhr: VekosFont.create("regular", "normal", true),
  vkhb: VekosFont.create("bold", "normal", true)
};

export const FONT_MANAGER = new FontManager(FONTS);