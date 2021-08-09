//

import {
  Color,
  CompoundPath,
  Path,
  PathItem,
  Point,
  Segment
} from "paper";
import {
  $,
  PointUtil
} from "./point";


export class Part {

  public item: PathItem;

  private constructor(item: PathItem) {
    this.item = item;
    item.fillColor = new Color(0, 0, 0);
    item.strokeColor = null;
  }

  public static line(startPoint: Point, endPoint: Point): Part {
    let path = PathUtil.line(startPoint, endPoint);
    let part = new Part(path);
    return part;
  }

  public static circle(centerPoint: Point, radius: number): Part {
    let path = PathUtil.circle(centerPoint, radius);
    let part = new Part(path);
    return part;
  }

  public static arc(centerPoint: Point, radius: number, fromAngle: number, toAngle: number): Part {
    let path = PathUtil.arc(centerPoint, radius, fromAngle, toAngle);
    let part = new Part(path);
    return part;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Part {
    let path = PathUtil.bezier(startPoint, startHandle, endHandle, endPoint);
    let part = new Part(path);
    return part;
  }

  public static empty(): Part {
    let path = PathUtil.empty();
    let part = new Part(path);
    return part;
  }

  public static of(item: PathItem): Part {
    let part = new Part(item);
    return part;
  }

  public static seq(...parts: Array<Part>): Part {
    let point = $(0, 0);
    let segments = new Array<Segment>();
    for (let part of parts) {
      let partPath = part.getPath();
      if (partPath !== undefined) {
        partPath.translate(point);
        let lastSegment = segments.pop();
        if (lastSegment) {
          let firstSegment = partPath.segments[0];
          let concatSegment = new Segment(firstSegment.point, lastSegment.handleIn, firstSegment.handleOut);
          segments.push(concatSegment, ...partPath.segments.slice(1));
        } else {
          segments.push(...partPath.segments);
        }
        point = partPath.lastSegment.point;
      } else {
        throw new Error("unsupported operation");
      }
    }
    let path = new Path({segments});
    path.closePath();
    let resultPart = new Part(path);
    return resultPart;
  }

  public static stack(...parts: Array<Part | PathItem>): Part {
    let children = parts.map((part) => (part instanceof Part) ? part.item : part);
    let item = new CompoundPath({children});
    let resultPart = new Part(item);
    return resultPart;
  }

  public static union(...parts: Array<Part | PathItem>): Part {
    let items = parts.map((part) => (part instanceof Part) ? part.item : part);
    let unitedItem = items.reduce((previousPart, part) => previousPart.unite(part));
    let resultPart = new Part(unitedItem);
    return resultPart;
  }

  public clone(): Part {
    let clonedItem = this.item.clone();
    let clonedPart = new Part(clonedItem);
    return clonedPart;
  }

  public translate(delta: Point): this {
    this.item.translate(delta);
    return this;
  }

  public moveOrigin(point: Point): this {
    return this.translate(point.multiply(-1));
  }

  public rotate(angle: number): this {
    this.item.rotate(angle, $(0, 0));
    return this;
  }

  public rotateHalfTurn(): this {
    return this.rotate(180);
  }

  public rotateQuarterTurn(): this {
    return this.rotate(90);
  }

  public scale(hor: number, ver: number): this {
    this.item.scale(hor, ver, $(0, 0));
    return this;
  }

  public reflectHor(): this {
    return this.scale(-1, 1);
  }

  public reflectVer(): this {
    return this.scale(1, -1);
  }

  public reverse(): this {
    let path = this.getPath();
    if (path !== undefined) {
      if (path.closed) {
        this.item.reverse();
      } else {
        let point = path.lastSegment.point;
        this.item.reverse();
        this.item.translate(point.multiply(-1));
      }
    } else {
      throw new Error("unsupported operation");
    }
    return this;
  }

  private getPath(): Path | undefined {
    let item = this.item;
    if (item instanceof Path) {
      return item;
    } else if (item instanceof CompoundPath) {
      if (item.children.length === 1 && item.firstChild instanceof Path) {
        return item.firstChild;
      } else {
        return undefined;
      }
    } else {
      throw new Error("cannot happen");
    }
  }

}


export class PathUtil {

  public static line(startPoint: Point, endPoint: Point): Path {
    let path = new Path({segments: [startPoint, endPoint]});
    return path;
  }

  public static circle(centerPoint: Point, radius: number): Path {
    let path = new Path.Circle(centerPoint, radius);
    return path;
  }

  public static arc(centerPoint: Point, radius: number, fromAngle: number, toAngle: number): Path {
    let fromPoint = PointUtil.polar(radius, fromAngle);
    let toPoint = PointUtil.polar(radius, toAngle);
    let throughPoint = PointUtil.polar(radius, (fromAngle + toAngle) / 2);
    let path = new Path.Arc(fromPoint, throughPoint, toPoint);
    path.translate(centerPoint);
    return path;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Path {
    let startSegment = new Segment(startPoint, undefined, startHandle ?? undefined);
    let endSegment = new Segment(endPoint, endHandle ?? undefined, undefined);
    let path = new Path({segments: [startSegment, endSegment]});
    return path;
  }

  public static empty(): Path {
    let path = new Path();
    return path;
  }

}