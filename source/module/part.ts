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
  PaperOffset
} from "paperjs-offset";
import {
  PathUtil
} from "./path";
import {
  $
} from "./point";


export class Part {

  public item: PathItem;

  private constructor(item: PathItem) {
    this.item = item;
    item.fillColor = new Color(0, 0, 0);
    item.strokeColor = null;
  }

  public static line(startPoint: Point, endPoint: Point): Part {
    const path = PathUtil.line(startPoint, endPoint);
    const part = new Part(path);
    return part;
  }

  public static circle(centerPoint: Point, radius: number): Part {
    const path = PathUtil.circle(centerPoint, radius);
    const part = new Part(path);
    return part;
  }

  public static arc(centerPoint: Point, radius: number, fromAngle: number, toAngle: number): Part {
    const path = PathUtil.arc(centerPoint, radius, fromAngle, toAngle);
    const part = new Part(path);
    return part;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Part {
    const path = PathUtil.bezier(startPoint, startHandle, endHandle, endPoint);
    const part = new Part(path);
    return part;
  }

  public static empty(): Part {
    const path = PathUtil.empty();
    const part = new Part(path);
    return part;
  }

  public static of(item: PathItem): Part {
    const part = new Part(item);
    return part;
  }

  public static seq(...parts: Array<Part>): Part {
    let point = $(0, 0);
    const segments = new Array<Segment>();
    for (const part of parts) {
      const partPath = part.getPath();
      if (partPath !== undefined) {
        partPath.translate(point);
        const lastSegment = segments.pop();
        if (lastSegment) {
          const firstSegment = partPath.segments[0];
          const concatSegment = new Segment(firstSegment.point, lastSegment.handleIn, firstSegment.handleOut);
          segments.push(concatSegment, ...partPath.segments.slice(1));
        } else {
          segments.push(...partPath.segments);
        }
        point = partPath.lastSegment.point;
      } else {
        throw new Error("unsupported operation");
      }
    }
    const path = new Path({segments});
    path.closePath();
    const resultPart = new Part(path);
    return resultPart;
  }

  public static stack(...parts: Array<Part | PathItem>): Part {
    const children = parts.map((part) => (part instanceof Part) ? part.item : part);
    const item = new CompoundPath({children});
    const resultPart = new Part(item);
    return resultPart;
  }

  public static union(...parts: Array<Part | PathItem>): Part {
    const items = parts.map((part) => (part instanceof Part) ? part.item : part);
    const unitedItem = items.reduce((previousPart, part) => previousPart.unite(part));
    const resultPart = new Part(unitedItem);
    return resultPart;
  }

  public clone(): Part {
    const clonedItem = this.item.clone();
    const clonedPart = new Part(clonedItem);
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
    const path = this.getPath();
    if (path !== undefined) {
      if (path.closed) {
        this.item.reverse();
      } else {
        const point = path.lastSegment.point;
        this.item.reverse();
        this.item.translate(point.multiply(-1));
      }
    } else {
      throw new Error("unsupported operation");
    }
    return this;
  }

  public toStroke(offset: number, join: StrokeJoin, cap: StrokeCap): Part {
    const path = this.getPath();
    if (path !== undefined) {
      const nextPath = PaperOffset.offsetStroke(path, offset, {join, cap, insert: false});
      return new Part(nextPath);
    } else {
      throw new Error("unsupported operation");
    }
  }

  private getPath(): Path | undefined {
    const item = this.item;
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


export type StrokeJoin = "miter" | "bevel" | "round";
export type StrokeCap = "round" | "butt";