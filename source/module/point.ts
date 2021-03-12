//

import {
  Point
} from "paper";


export class PointUtil {

  public static ortho(x: number, y: number): Point {
    let point = new Point({x, y});
    return point;
  }

  public static polar(length: number, angle: number): Point {
    let point = new Point({length, angle});
    return point;
  }

}


export function $(x: number, y?: number): Point {
  return new Point(x, y ?? x);
}