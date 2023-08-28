//

import {
  Point
} from "paper";


export class PointUtil {

  public static ortho(x: number, y: number): Point {
    const point = new Point({x, y});
    return point;
  }

  public static polar(length: number, angle: number): Point {
    const point = new Point({length, angle});
    return point;
  }

}


export const $ = Object.assign(PointUtil.ortho, {
  origin: PointUtil.ortho(0, 0),
  ortho: PointUtil.ortho,
  polar: PointUtil.polar
});