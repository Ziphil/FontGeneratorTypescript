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


class PathItemWrapper<P extends boolean> {

  public item: PathItem;
  private isPart: P;

  protected constructor(item: PathItem, isPart: P) {
    this.item = item;
    this.isPart = isPart;
    item.fillColor = new Color(0, 0, 0);
    item.strokeColor = null;
  }

  public clone(): this {
    const clonedItem = this.item.clone();
    const clonedObject = new (this.constructor as any)(clonedItem, this.isPart);
    return clonedObject;
  }

  public translate(delta: Point): this {
    this.item.translate(delta);
    return this;
  }

  public moveOrigin(point: Point): this {
    return this.translate(point.multiply(-1));
  }

  public rotate(angle: number, center?: Point): this {
    this.item.rotate(angle, center ?? $.origin);
    return this;
  }

  public rotateHalfTurn(center?: Point): this {
    return this.rotate(180, center);
  }

  public rotateQuarterTurn(center?: Point): this {
    return this.rotate(90, center);
  }

  public scale(hor: number, ver: number, center?: Point): this {
    this.item.scale(hor, ver, center ?? $.origin);
    return this;
  }

  public reflectHor(center?: Point): this {
    return this.scale(-1, 1, center);
  }

  public reflectVer(center?: Point): this {
    return this.scale(1, -1, center);
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

  public getPath(): Path | undefined {
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


export class Contour extends PathItemWrapper<false> {

  protected constructor(item: PathItem) {
    super(item, false);
  }

  public static seq(...parts: Array<Contour>): Contour {
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
    const resultContour = new Contour(path);
    return resultContour;
  }

  public static line(startPoint: Point, endPoint: Point): Contour {
    const path = PathUtil.line(startPoint, endPoint);
    const part = new Contour(path);
    return part;
  }

  public static circle(centerPoint: Point, radius: number): Contour {
    const path = PathUtil.circle(centerPoint, radius);
    const part = new Contour(path);
    return part;
  }

  public static arc(centerPoint: Point, radius: number, fromAngle: number, toAngle: number): Contour {
    const path = PathUtil.arc(centerPoint, radius, fromAngle, toAngle);
    const part = new Contour(path);
    return part;
  }

  public static bezier(startPoint: Point, startHandle: Point | null, endHandle: Point | null, endPoint: Point): Contour {
    const path = PathUtil.bezier(startPoint, startHandle, endHandle, endPoint);
    const part = new Contour(path);
    return part;
  }

  public static empty(): Contour {
    const path = PathUtil.empty();
    const part = new Contour(path);
    return part;
  }

  public static of(item: PathItem): Contour {
    const part = new Contour(item);
    return part;
  }

  public toPart(): Part {
    const item = this.item;
    const closedItem = item.clone();
    closedItem.closePath();
    const part = Part.of(closedItem);
    return part;
  }

  public toStrokePart(offset: number, join: StrokeJoin, cap: StrokeCap): Part {
    const path = this.getPath();
    if (path !== undefined) {
      const strokePath = PaperOffset.offsetStroke(path, offset, {join, cap, insert: false});
      const part = Part.of(strokePath);
      return part;
    } else {
      throw new Error("unsupported operation");
    }
  }

}


export class Part extends PathItemWrapper<true> {

  protected constructor(item: PathItem) {
    super(item, true);
  }

  public static seq(...parts: Array<Contour>): Part {
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

  public static circle(centerPoint: Point, radius: number): Part {
    const path = PathUtil.circle(centerPoint, radius);
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

}


export type StrokeJoin = "miter" | "bevel" | "round";
export type StrokeCap = "round" | "butt";