//

import {
  Point
} from "paper";


export function $(...args: Pointable): Point {
  if (args.length === 2) {
    return new Point(args[0], args[1]);
  } else if (typeof args[0] === "object") {
    return new Point(args[0]);
  } else {
    return new Point(args[0], args[0]);
  }
}

type Pointable = [x: number, y: number] | [{x: number, y: number}] | [{length: number, angle: number}] | [number];