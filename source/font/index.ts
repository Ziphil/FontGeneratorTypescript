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
  klmr: new KalegFont("regular", "normal", "miter", false, false),
  klmb: new KalegFont("bold", "normal", "miter", false, false),
  klbr: new KalegFont("regular", "normal", "bevel", false, false),
  klbb: new KalegFont("bold", "normal", "bevel", false, false),
  klrr: new KalegFont("regular", "normal", "round", false, false),
  klrb: new KalegFont("bold", "normal", "round", false, false),
  klmbr: new KalegFont("regular", "normal", "miter", false, true),
  klmbb: new KalegFont("bold", "normal", "miter", false, true),
  klbbr: new KalegFont("regular", "normal", "bevel", false, true),
  klbbb: new KalegFont("bold", "normal", "bevel", false, true),
  klrbr: new KalegFont("regular", "normal", "round", false, true),
  klrbb: new KalegFont("bold", "normal", "round", false, true),
  klmer: new KalegFont("regular", "expanded", "miter", false, false),
  klmeb: new KalegFont("bold", "expanded", "miter", false, false),
  klber: new KalegFont("regular", "expanded", "bevel", false, false),
  klbeb: new KalegFont("bold", "expanded", "bevel", false, false),
  klrer: new KalegFont("regular", "expanded", "round", false, false),
  klreb: new KalegFont("bold", "expanded", "round", false, false),
  klmber: new KalegFont("regular", "expanded", "miter", false, true),
  klmbeb: new KalegFont("bold", "expanded", "miter", false, true),
  klbber: new KalegFont("regular", "expanded", "bevel", false, true),
  klbbeb: new KalegFont("bold", "expanded", "bevel", false, true),
  klrber: new KalegFont("regular", "expanded", "round", false, true),
  klrbeb: new KalegFont("bold", "expanded", "round", false, true),
  klmsr: new KalegFont("regular", "normal", "miter", true, false),
  klmsb: new KalegFont("bold", "normal", "miter", true, false),
  klbsr: new KalegFont("regular", "normal", "bevel", true, false),
  klbsb: new KalegFont("bold", "normal", "bevel", true, false),
  klrsr: new KalegFont("regular", "normal", "round", true, false),
  klrsb: new KalegFont("bold", "normal", "round", true, false),
  klmbsr: new KalegFont("regular", "normal", "miter", true, true),
  klmbsb: new KalegFont("bold", "normal", "miter", true, true),
  klbbsr: new KalegFont("regular", "normal", "bevel", true, true),
  klbbsb: new KalegFont("bold", "normal", "bevel", true, true),
  klrbsr: new KalegFont("regular", "normal", "round", true, true),
  klrbsb: new KalegFont("bold", "normal", "round", true, true)
};

export const FONT_MANAGER = new FontManager(FONTS);