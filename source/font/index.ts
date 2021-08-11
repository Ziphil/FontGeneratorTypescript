//

import {
  FontManager
} from "../module";
import {
  GilitFont
} from "./gilit/font";
import {
  KalegFont
} from "./kaleg/font";
import {
  VekosFont
} from "./vekos/font";


const FONTS = {
  vkr: new VekosFont("regular", "normal", false),
  vkb: new VekosFont("bold", "normal", false),
  vkt: new VekosFont("thin", "normal", false),
  vkcr: new VekosFont("regular", "condensed", false),
  vkcb: new VekosFont("bold", "condensed", false),
  vkct: new VekosFont("thin", "condensed", false),
  vker: new VekosFont("regular", "expanded", false),
  vkeb: new VekosFont("bold", "expanded", false),
  vket: new VekosFont("thin", "expanded", false),
  vkhr: new VekosFont("regular", "normal", true),
  vkhb: new VekosFont("bold", "normal", true),
  glr: new GilitFont("regular", "normal", false, false),
  glb: new GilitFont("bold", "normal", false, false),
  gler: new GilitFont("regular", "expanded", false, false),
  gleb: new GilitFont("bold", "expanded", false, false),
  gltr: new GilitFont("regular", "normal", true, false),
  gltb: new GilitFont("bold", "normal", true, false),
  glser: new GilitFont("regular", "expanded", false, true),
  glseb: new GilitFont("bold", "expanded", false, true),
  klmr: new KalegFont("regular", "normal", "miter", false),
  klmb: new KalegFont("bold", "normal", "miter", false),
  klbr: new KalegFont("regular", "normal", "bevel", false),
  klbb: new KalegFont("bold", "normal", "bevel", false),
  klrr: new KalegFont("regular", "normal", "round", false),
  klrb: new KalegFont("bold", "normal", "round", false),
  klmbr: new KalegFont("regular", "normal", "miter", true),
  klmbb: new KalegFont("bold", "normal", "miter", true),
  klbbr: new KalegFont("regular", "normal", "bevel", true),
  klbbb: new KalegFont("bold", "normal", "bevel", true),
  klrbr: new KalegFont("regular", "normal", "round", true),
  klrbb: new KalegFont("bold", "normal", "round", true)
};

export const FONT_MANAGER = new FontManager(FONTS);