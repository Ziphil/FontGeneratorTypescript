#


import fontforge
import os
import re
import sys
import xml.etree.ElementTree as ElementTree


font = fontforge.font()

font.familyname = __familyname__
font.fontname = __fontname__
font.fullname = __fullname__
font.weight = __weight__
font.version = __version__
font.copyright = __copyright__

font.encoding = "UnicodeFull"

font.em = int(__em__)
font.ascent = int(__ascent__)
font.descent = int(__descent__)

svgdir = __svgdir__

for file in os.listdir(svgdir):
  result = re.match(r"(\d+)\.svg", file)
  if result:
    codepoint = int(result.group(1))
    tree = ElementTree.parse(svgdir + "/" + file)
    root = tree.getroot()
    width = float(root.attrib["glyph-width"])
    glyph = font.createMappedChar(codepoint)
    if root.find("{http://www.w3.org/2000/svg}g") is not None or root.find("{http://www.w3.org/2000/svg}path") is not None:
      glyph.importOutlines(svgdir + "/%d.svg" % codepoint)
      if __autohint__:
        glyph.autoHint()
    glyph.width = width

font.generate(__fontfilename__)
font.close()