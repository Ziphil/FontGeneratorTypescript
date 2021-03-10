//

import {
  VekosFont
} from "./vekos/font";


export const FONTS = {
  vkr: () => VekosFont.create("regular", "normal", false),
  vkb: () => VekosFont.create("bold", "normal", false),
  vkt: () => VekosFont.create("thin", "normal", false),
  vkcr: () => VekosFont.create("regular", "condensed", false),
  vkcb: () => VekosFont.create("bold", "condensed", false),
  vkct: () => VekosFont.create("thin", "condensed", false),
  vker: () => VekosFont.create("regular", "extended", false),
  vkeb: () => VekosFont.create("bold", "extended", false),
  vket: () => VekosFont.create("thin", "extended", false),
  vkhr: () => VekosFont.create("regular", "normal", true),
  vkhb: () => VekosFont.create("bold", "normal", true)
};