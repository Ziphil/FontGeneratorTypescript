//

import {
  FontManager
} from "../module";
import {
  ColfomFont
} from "./colfom/font";
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
  glr: new GilitFont("regular", "normal", false),
  glb: new GilitFont("bold", "normal", false),
  gler: new GilitFont("regular", "expanded", false),
  gleb: new GilitFont("bold", "expanded", false),
  gltr: new GilitFont("regular", "triangle", false),
  gltb: new GilitFont("bold", "triangle", false),
  glser: new GilitFont("regular", "expanded", true),
  glseb: new GilitFont("bold", "expanded", true),
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
  klrbb: new KalegFont("bold", "normal", "round", true),
  klmer: new KalegFont("regular", "expanded", "miter", false),
  klmeb: new KalegFont("bold", "expanded", "miter", false),
  klber: new KalegFont("regular", "expanded", "bevel", false),
  klbeb: new KalegFont("bold", "expanded", "bevel", false),
  klrer: new KalegFont("regular", "expanded", "round", false),
  klreb: new KalegFont("bold", "expanded", "round", false),
  klmber: new KalegFont("regular", "expanded", "miter", true),
  klmbeb: new KalegFont("bold", "expanded", "miter", true),
  klbber: new KalegFont("regular", "expanded", "bevel", true),
  klbbeb: new KalegFont("bold", "expanded", "bevel", true),
  klrber: new KalegFont("regular", "expanded", "round", true),
  klrbeb: new KalegFont("bold", "expanded", "round", true),
  klmsr: new KalegFont("regular", "normal", "miter", false, "square"),
  klmsb: new KalegFont("bold", "normal", "miter", false, "square"),
  klbsr: new KalegFont("regular", "normal", "bevel", false, "square"),
  klbsb: new KalegFont("bold", "normal", "bevel", false, "square"),
  klrsr: new KalegFont("regular", "normal", "round", false, "square"),
  klrsb: new KalegFont("bold", "normal", "round", false, "square"),
  klmbsr: new KalegFont("regular", "normal", "miter", true, "square"),
  klmbsb: new KalegFont("bold", "normal", "miter", true, "square"),
  klbbsr: new KalegFont("regular", "normal", "bevel", true, "square"),
  klbbsb: new KalegFont("bold", "normal", "bevel", true, "square"),
  klrbsr: new KalegFont("regular", "normal", "round", true, "square"),
  klrbsb: new KalegFont("bold", "normal", "round", true, "square"),
  cfr: new ColfomFont("regular", "normal")
};

export const FONT_MANAGER = new FontManager(FONTS);