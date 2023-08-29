//

import {
  Path,
  Point,
  Segment
} from "paper";
import {
  PointUtil
} from "./point";


export class PathUtil {

  public static line(startPoint: Point, endPoint: Point): Path {
    const path = new Path({segments: [startPoint, endPoint]});
    return path;
  }

  public static circle(centerPoint: Point, radius: number): Path {
    const path = new Path.Circle(centerPoint, radius);
    return path;
  }

  public static ellipse(centerPoint: Point, horRadius: number, verRadius: number): Path {
    const path = PathUtil.circle(centerPoint, horRadius);
    path.scale(1, verRadius / horRadius, centerPoint);
    return path;
  }

  public static arc(centerPoint: Point, radius: number, fromAngle: number, toAngle: number): Path {
    const fromPoint = PointUtil.polar(radius, fromAngle);
    const toPoint = PointUtil.polar(radius, toAngle);
    const throughPoint = PointUtil.polar(radius, (fromAngle + toAngle) / 2);
    const path = new Path.Arc(fromPoint, throughPoint, toPoint);
    path.translate(centerPoint);
    return path;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Path {
    const startSegment = new Segment(startPoint, undefined, startHandle ?? undefined);
    const endSegment = new Segment(endPoint, endHandle ?? undefined, undefined);
    const path = new Path({segments: [startSegment, endSegment]});
    return path;
  }

  public static empty(): Path {
    const path = new Path();
    return path;
  }

}