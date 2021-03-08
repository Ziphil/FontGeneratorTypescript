//

import {
  Color,
  CompoundPath,
  Path,
  PathItem,
  Point,
  Segment
} from "paper";


export class Part extends CompoundPath {

  public constructor(object: object) {
    super(object);
    this.fillColor = new Color(0, 0, 0);
    this.strokeColor = new Color(1, 0, 0);
  }

  public static lineAsPath(startPoint: Point, endPoint: Point): Path {
    let path = new Path([startPoint, endPoint]);
    return path;
  }

  public static bezierAsPath(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Path {
    let startSegment = new Segment(startPoint, undefined, startHandle ?? undefined);
    let endSegment = new Segment(endPoint, endHandle ?? undefined, undefined);
    let path = new Path([startSegment, endSegment]);
    return path;
  }

  public static line(startPoint: Point, endPoint: Point): Part {
    let path = Part.lineAsPath(startPoint, endPoint);
    let part = new Part({children: [path]});
    return part;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Part {
    let path = Part.bezierAsPath(startPoint, startHandle, endHandle, endPoint);
    let part = new Part({children: [path]});
    return part;
  }

  public static seq(...parts: Array<Part>): Part {
    let path = new Path();
    let point = new Point(0, 0);
    for (let part of parts) {
      if (part.children.length === 1 && part.firstChild instanceof Path) {
        let child = part.firstChild;
        child.translate(point);
        child.remove();
        point = child.lastSegment.point;
        path.addSegments(child.segments);
      } else {
        throw new Error("unsupported operation");
      }
    }
    path.closePath();
    let resultPart = new Part({children: [path]});
    return resultPart;
  }

  public static stack(...parts: Array<PathItem>): Part {
    let resultPart = new Part({children: parts});
    return resultPart;
  }

  public static union(...parts: Array<PathItem>): Part {
    let unitedPart = parts.reduce((previousPart, part) => previousPart.unite(part, {insert: false}));
    let resultPart = new Part({children: [unitedPart]});
    parts[0].remove();
    return resultPart;
  }

  public translate(delta: Point): this {
    super.translate(delta);
    return this;
  }

  public moveZeroTo(point: Point): this {
    return this.translate(point.multiply(-1));
  }

  public rotate(angle: number, center?: Point): this {
    super.rotate(angle, center);
    return this;
  }

  public rotateZero(angle: number): this {
    return this.rotate(angle, new Point(0, 0));
  }

  public rotateHalfTurnZero(): this {
    return this.rotateZero(180);
  }

  public rotateQuarterTurnZero(): this {
    return this.rotateZero(90);
  }

  public scale(scale: number, center?: Point): this;
  public scale(hor: number, ver: number, center?: Point): this;
  public scale(...args: [any, any?, any?]): this {
    super.scale(...args);
    return this;
  }

  public scaleZero(scale: number): this;
  public scaleZero(hor: number, ver: number): this;
  public scaleZero(...args: [any, any?]): this {
    return this.scale(...args, new Point(0, 0));
  }

  public reflectHor(center?: Point): this {
    return this.scale(-1, 1, center);
  }

  public reflectHorZero(): this {
    return this.reflectHor(new Point(0, 0));
  }

  public reflectVer(center?: Point): this {
    return this.scale(1, -1, center);
  }

  public reflectVerZero(): this {
    return this.reflectVer(new Point(0, 0));
  }

  public reverse(): this {
    super.reverse();
    return this;
  }

  public reverseZero(): this {
    if (this.children.length === 1 && this.firstChild instanceof Path) {
      return this.reverse().translate(this.firstChild.firstSegment.point.multiply(-1));
    } else {
      throw new Error("unsupported operation");
    }
  }

}